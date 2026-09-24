import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Screening Room buttons (docs/design-handoff/design-system/components/Button.md).
 * Use `buttonVariants()` on <a> for links; focus ring comes from :focus-visible in globals.css.
 */
const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center gap-2.5 rounded-md border border-transparent font-sans font-medium tracking-[0.01em] whitespace-nowrap select-none transition-colors duration-(--duration-hover) ease-standard disabled:cursor-not-allowed disabled:border-border-strong disabled:bg-secondary disabled:text-fg-disabled aria-disabled:cursor-not-allowed aria-disabled:border-border-strong aria-disabled:bg-secondary aria-disabled:text-fg-disabled [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed',
        outline: 'border-input bg-transparent text-foreground hover:border-foreground hover:bg-foreground/6',
        onMedia:
          'border-foreground/70 bg-scrim/55 text-foreground hover:border-foreground hover:bg-foreground hover:text-background',
      },
      size: {
        default: 'h-12 px-6 text-[14px]',
        sm: 'h-10 px-[18px] text-[13px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
