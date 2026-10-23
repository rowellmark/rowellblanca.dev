// shadcn/ui-style primitives for the admin CRM (neutral zinc palette, hand-written
// so the public site's Tailwind config and globals stay untouched).
import React from 'react';
import { cn } from '@/utils/cn';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';

const buttonVariants: Record<ButtonVariant, string> = {
  default: 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm',
  secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
  outline: 'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 shadow-sm',
  ghost: 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950',
  destructive: 'bg-red-600 text-white hover:bg-red-500 shadow-sm',
};
const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  default: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-sm',
  icon: 'h-10 w-10',
};

export function buttonClass(variant: ButtonVariant = 'default', size: ButtonSize = 'default', className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
    buttonVariants[variant],
    buttonSizes[size],
    className
  );
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }
>(({ className, variant, size, type = 'button', ...props }, ref) => (
  <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...props} />
));
Button.displayName = 'Button';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm',
        'placeholder:text-zinc-400 transition-colors',
        'focus-visible:outline-none focus-visible:border-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-200',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('text-sm font-medium leading-none text-zinc-900', className)} {...props} />;
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-sm', className)} {...props} />;
}
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />;
}
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-base font-semibold leading-none tracking-tight', className)} {...props} />;
}
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-zinc-500', className)} {...props} />;
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'warning';
const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-zinc-950 text-white border-transparent',
  secondary: 'bg-zinc-100 text-zinc-800 border-transparent',
  outline: 'text-zinc-700 border-zinc-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
};
export function Badge({ className, variant = 'secondary', ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium', badgeVariants[variant], className)}
      {...props}
    />
  );
}

export function Separator({ className }: { className?: string }) {
  return <div role="separator" className={cn('h-px w-full bg-zinc-200', className)} />;
}
