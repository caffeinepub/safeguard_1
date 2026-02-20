import { InputHTMLAttributes } from 'react';

export default function NeumorphicInput({
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full min-h-[44px] px-4 py-3 rounded-xl bg-neumorphic-surface text-neumorphic-text neumorphic-inset focus:outline-none focus:ring-2 focus:ring-neumorphic-accent transition-all touch-manipulation ${className}`}
      {...props}
    />
  );
}
