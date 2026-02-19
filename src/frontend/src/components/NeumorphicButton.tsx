import { ReactNode, ButtonHTMLAttributes } from 'react';

interface NeumorphicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export default function NeumorphicButton({
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}: NeumorphicButtonProps) {
  return (
    <button
      className={`
        neumorphic-button
        ${variant === 'primary' ? 'bg-neumorphic-accent text-white' : 'bg-neumorphic-base text-neumorphic-text'}
        px-6 py-3 rounded-xl font-medium
        transition-all duration-200
        active:neumorphic-pressed
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center
        min-h-[44px] min-w-[44px]
        touch-manipulation
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
