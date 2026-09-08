import { Button as ButtonPrimitive } from '@base-ui/react/button';
import type { ComponentProps } from 'react';

// shadcn Base UI/Nova Button을 C:V의 semantic CSS와 사용하는 variant에 맞췄다.
type ButtonProps = ComponentProps<'button'> & {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'icon' | 'compact';
};

export function Button({
  className = '',
  variant = 'default',
  size = 'default',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      className={`button ${className}`}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      type={type}
      {...props}
    />
  );
}
