import * as React from 'react'
import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'

import {
  PrimitiveButton,
  PrimitiveButtonProps,
} from './primitives/button-primitive'
import Spinner from './spinner'
import { cn } from '@lib/utils'

interface ButtonProps extends PrimitiveButtonProps {
  className?: string
  isLoading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  asChild?: boolean
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      size,
      asChild = false,
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : PrimitiveButton

    return (
      <Comp
        ref={ref}
        className={cn(className, isLoading ? 'ripple-loop' : '')}
        size={size}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner />
            {size != 'icon' && <span>{loadingText || children}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span>{leftIcon}</span>}
            {children}
            {rightIcon && <span>{rightIcon}</span>}
          </>
        )}
      </Comp>
    )
  }
)

Button.displayName = 'Button'
