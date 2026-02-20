import { ButtonHTMLAttributes } from 'react';

interface NeumorphicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export default function NeumorphicButton({
  children,
  className = '',
  variant = 'primary',
  disabled,
  ...props
}: NeumorphicButtonProps) {
  const baseClasses = 'min-h-[44px] px-6 py-3 rounded-xl font-medium transition-all touch-manipulation';
  const variantClasses = variant === 'primary'
    ? 'bg-neumorphic-accent text-white neumorphic-raised hover:brightness-110'
    : 'bg-neumorphic-surface text-neumorphic-text neumorphic-raised hover:brightness-95';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
