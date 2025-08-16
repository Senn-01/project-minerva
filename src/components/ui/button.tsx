import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all",
          "border-4 border-black bg-white",
          "hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-brutal-sm",
          {
            'shadow-brutal': true,
            'px-6 py-3': size === 'default',
            'px-4 py-2 text-sm': size === 'sm',
            'px-8 py-4 text-lg': size === 'lg',
            'h-10 w-10 p-0': size === 'icon',
            'bg-brutal-yellow': variant === 'primary',
            'bg-brutal-red text-white': variant === 'destructive',
            'border-0 shadow-none hover:shadow-none': variant === 'ghost',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }