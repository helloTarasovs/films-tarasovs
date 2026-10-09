import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Analytics is a side effect we only want to observe, not send.
const track = vi.fn()
vi.mock('@vercel/analytics', () => ({ track: (...args: unknown[]) => track(...args) }))

// ACCESS_KEY is read when the module loads, so each test imports a fresh copy
// after setting the environment variable.
async function renderForm({ accessKey = 'test-key' }: { accessKey?: string } = {}) {
  vi.stubEnv('NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY', accessKey)
  vi.resetModules()
  const { ContactForm } = await import('./contact-form')
  render(<ContactForm />)
  return userEvent.setup()
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Ada Lovelace')
  await user.type(screen.getByLabelText('Email'), 'ada@example.com')
  await user.type(screen.getByLabelText('Message'), 'A 30-second launch film.')
}

function mockFetch(response: { status?: number; body?: unknown } | Error) {
  const fetchMock =
    response instanceof Error
      ? vi.fn().mockRejectedValue(response)
      : vi.fn().mockResolvedValue(
          new Response(JSON.stringify(response.body ?? {}), { status: response.status ?? 200 }),
        )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const submit = () => screen.getByRole('button', { name: /send inquiry|try again/i })

describe('ContactForm', () => {
  beforeEach(() => {
    track.mockClear()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('validation', () => {
    it('shows an error for each empty field and focuses the first one', async () => {
      const fetchMock = mockFetch({ body: { success: true } })
      const user = await renderForm()

      await user.click(submit())

      expect(screen.getByText('Please enter your name.')).toBeInTheDocument()
      expect(screen.getByText('Please enter your email.')).toBeInTheDocument()
      expect(screen.getByText('Please tell me a little about the project.')).toBeInTheDocument()
      expect(screen.getByLabelText('Name')).toHaveFocus()
      expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true')
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('rejects an email address without a domain', async () => {
      mockFetch({ body: { success: true } })
      const user = await renderForm()

      await user.type(screen.getByLabelText('Name'), 'Ada')
      await user.type(screen.getByLabelText('Email'), 'ada@example')
      await user.type(screen.getByLabelText('Message'), 'Hello')
      await user.click(submit())

      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toHaveFocus()
    })

    it('clears a field error as soon as the user edits that field', async () => {
      mockFetch({ body: { success: true } })
      const user = await renderForm()

      await user.click(submit())
      await user.type(screen.getByLabelText('Name'), 'A')

      expect(screen.queryByText('Please enter your name.')).not.toBeInTheDocument()
      expect(screen.getByText('Please enter your email.')).toBeInTheDocument()
    })
  })

  describe('submission', () => {
    it('sends the trimmed values to Web3Forms and shows a success message', async () => {
      const fetchMock = mockFetch({ body: { success: true } })
      const user = await renderForm()

      await user.type(screen.getByLabelText('Name'), '  Ada Lovelace  ')
      await user.type(screen.getByLabelText('Email'), 'ada@example.com')
      await user.type(screen.getByLabelText('Message'), 'A 30-second launch film.')
      await user.click(submit())

      expect(await screen.findByText(/your message has been sent/i)).toBeInTheDocument()
      expect(fetchMock).toHaveBeenCalledTimes(1)

      const [url, init] = fetchMock.mock.calls[0]
      expect(url).toBe('https://api.web3forms.com/submit')
      expect(JSON.parse(init.body)).toMatchObject({
        access_key: 'test-key',
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        message: 'A 30-second launch film.',
        subject: 'New film inquiry from films.tarasovs.me',
        botcheck: false,
      })
      expect(screen.getByLabelText('Name')).toHaveValue('')
      expect(track).toHaveBeenCalledWith('contact_form_success')
    })

    it('uses the subject the visitor typed', async () => {
      const fetchMock = mockFetch({ body: { success: true } })
      const user = await renderForm()

      await fillValidForm(user)
      await user.type(screen.getByLabelText('Subject'), 'Product film')
      await user.click(submit())

      await screen.findByText(/your message has been sent/i)
      expect(JSON.parse(fetchMock.mock.calls[0][1].body).subject).toBe('Product film')
    })

    it('sends only one request while the first one is still in flight', async () => {
      // Keep the request pending so the second click lands mid-flight.
      let respond!: (r: Response) => void
      const fetchMock = vi.fn(() => new Promise<Response>((resolve) => (respond = resolve)))
      vi.stubGlobal('fetch', fetchMock)
      const user = await renderForm()

      await fillValidForm(user)
      await user.dblClick(submit())

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled()

      respond(new Response(JSON.stringify({ success: true })))
      expect(await screen.findByText(/your message has been sent/i)).toBeInTheDocument()
    })
  })

  describe('errors', () => {
    it('explains rate limiting when Web3Forms returns 429', async () => {
      mockFetch({ status: 429 })
      const user = await renderForm()

      await fillValidForm(user)
      await user.click(submit())

      expect(await screen.findByText(/too many messages/i)).toBeInTheDocument()
      expect(track).toHaveBeenCalledWith('contact_form_error', { reason: 'rate_limit' })
    })

    it('shows an error when Web3Forms rejects the submission', async () => {
      mockFetch({ body: { success: false } })
      const user = await renderForm()

      await fillValidForm(user)
      await user.click(submit())

      expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
      expect(track).toHaveBeenCalledWith('contact_form_error', { reason: 'rejected' })
      expect(submit()).toHaveTextContent('Try again')
    })

    it('shows an error and keeps the typed text when the network fails', async () => {
      mockFetch(new TypeError('Failed to fetch'))
      const user = await renderForm()

      await fillValidForm(user)
      await user.click(submit())

      expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
      expect(track).toHaveBeenCalledWith('contact_form_error', { reason: 'network' })
      expect(screen.getByLabelText('Name')).toHaveValue('Ada Lovelace')
    })

    it('disables the form and shows the email address when no access key is set', async () => {
      const fetchMock = mockFetch({ body: { success: true } })
      await renderForm({ accessKey: '' })

      expect(submit()).toBeDisabled()
      expect(screen.getByRole('status')).toHaveTextContent('hello@tarasovs.me')
      await waitFor(() => expect(fetchMock).not.toHaveBeenCalled())
    })
  })
})
