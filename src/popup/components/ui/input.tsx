import { Input as InputPrimitive } from '@base-ui/react/input';
import type { ComponentProps } from 'react';

// shadcn Base UI/Nova Input의 스타일은 Popup의 semantic CSS에서 관리한다.
export function Input({ className = '', ...props }: ComponentProps<'input'>) {
  return (
    <InputPrimitive
      data-slot="input"
      className={`input ${className}`}
      {...props}
    />
  );
}
