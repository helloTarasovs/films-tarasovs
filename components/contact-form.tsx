'use client'

import { track } from '@vercel/analytics'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'

const fieldClass =
  'w-full rounded-md border border-border/70 bg-card/40 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary-text focus:ring-1 focus:ring-primary-text/40 aria-[invalid=true]:border-destructive'

const ENDPOINT = 'https://api.web3forms.com/submit'
// Web3Forms needs the access key in the browser, so NEXT_PUBLIC_ is intentional. It only
// identifies the form: abuse protection comes from the Web3Forms domain restriction and
// spam filtering, not from keeping this value secret.
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
const EMAIL = 'hello@tarasovs.me'
const DEFAULT_SUBJECT = 'New film inquiry from films.tarasovs.me'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'
type Field = 'name' | 'email' | 'message'
type Errors = Partial<Record<Field, string>>

const buttonLabel: Record<FormStatus, string> = {
  idle: 'Send inquiry',
  submitting: 'Sending...',
  success: 'Sent',
  error: 'Try again',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: Record<Field, string>): Errors {
  const errors: Errors = {}
  if (!values.name) errors.name = 'Please enter your name.'
  if (!values.email) errors.email = 'Please enter your email.'
  else if (!emailPattern.test(values.email)) errors.email = 'Please enter a valid email address.'
  if (!values.message) errors.message = 'Please tell me a little about the project.'
  return errors
}

export function ContactForm() {
  const abortRef = useRef<AbortController | null>(null)
  // Synchronous guard: state updates land after a render, a fast double click doesn't.
  const inFlight = useRef(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [feedback, setFeedback] = useState('')

  const configured = Boolean(ACCESS_KEY)

  useEffect(() => {
    if (!configured && process.env.NODE_ENV !== 'production') {
      console.error('[contact] NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set; the form is disabled.')
    }
    // Cancel an in-flight request when the component unmounts.
    return () => abortRef.current?.abort()
  }, [configured])

  function fail(reason: string, message: string) {
    setStatus('error')
    setFeedback(message)
    track('contact_form_error', { reason })
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (inFlight.current) return

    const form = e.currentTarget
    const data = new FormData(form)
    const text = (key: string) => String(data.get(key) ?? '').trim()
    const values = { name: text('name'), email: text('email'), message: text('message') }
    const subject = text('subject')

    const found = validate(values)
    setErrors(found)
    const firstInvalid = (['name', 'email', 'message'] as Field[]).find((f) => found[f])
    if (firstInvalid) {
      setStatus('idle')
      setFeedback('')
      document.getElementById(firstInvalid)?.focus()
      return
    }

    if (!ACCESS_KEY) {
      fail('config', `The form is unavailable right now. Please email ${EMAIL}.`)
      return
    }

    inFlight.current = true
    const controller = new AbortController()
    abortRef.current = controller

    setStatus('submitting')
    setFeedback('')
    track('contact_form_submit')

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          from_name: 'films.tarasovs.me',
          subject: subject || DEFAULT_SUBJECT,
          name: values.name,
          email: values.email,
          message: values.message,
          botcheck: data.get('botcheck') === 'on',
        }),
        signal: controller.signal,
      })

      if (response.status === 429) {
        fail('rate_limit', 'Too many messages in a short time. Please wait a minute and try again.')
        return
      }

      let result: { success?: boolean } | null = null
      try {
        result = await response.json()
      } catch {
        result = null
      }

      if (!response.ok || result?.success !== true) {
        fail(!response.ok ? 'http' : result ? 'rejected' : 'invalid_response', `Something went wrong. Please try again or email ${EMAIL}.`)
        return
      }

      form.reset()
      setErrors({})
      setStatus('success')
      setFeedback('Thank you. Your message has been sent. I will get back to you shortly.')
      track('contact_form_success')
    } catch (error) {
      if (controller.signal.aborted) return // unmounted: don't touch state
      if (process.env.NODE_ENV !== 'production') console.error('[contact] submit failed', error)
      fail('network', `Something went wrong. Please try again or email ${EMAIL}.`)
    } finally {
      inFlight.current = false
    }
  }

  // Editing after a result clears the "Sent" / "Try again" state and the field's error.
  function handleChange(e: FormEvent<HTMLFormElement>) {
    const field = (e.target as HTMLInputElement).name as Field
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    if (status === 'success') {
      setStatus('idle')
      setFeedback('')
    }
  }

  const submitting = status === 'submitting'
  const feedbackText = configured
    ? feedback
    : `The form is unavailable right now. Please email ${EMAIL}.`

  return (
    <form
      onSubmit={handleSubmit}
      onChange={handleChange}
      className="space-y-6"
      noValidate
      aria-busy={submitting}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm text-foreground">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={fieldClass}
          />
          <FieldError id="name-error" message={errors.name} />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@studio.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={fieldClass}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block text-sm text-foreground">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="What&apos;s this about?"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell me about the project, timeline, and what success looks like."
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={`${fieldClass} resize-y`}
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      {/* Honeypot: invisible to people and assistive tech, still present for bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={submitting || !configured}
        className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
      >
        {buttonLabel[status]}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>

      <div role="status" aria-live="polite" className="min-h-6">
        {feedbackText && (
          <p
            className={
              status === 'success'
                ? 'rounded-md border border-border-strong bg-card/40 px-4 py-3 text-sm text-foreground'
                : 'rounded-md border border-destructive/60 bg-card/40 px-4 py-3 text-sm text-foreground'
            }
          >
            <span className="font-medium">{status === 'success' ? 'Sent. ' : 'Error. '}</span>
            {feedbackText}
          </p>
        )}
      </div>
    </form>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-2 text-sm text-foreground">
      <span aria-hidden className="mr-1.5 text-destructive">
        ●
      </span>
      {message}
    </p>
  )
}
