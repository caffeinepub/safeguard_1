import { InputHTMLAttributes } from 'react';

export default function NeumorphicInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`
        w-full px-4 py-3 rounded-xl
        neumorphic-inset
        bg-neumorphic-base
        text-neumorphic-text
        placeholder:text-neumorphic-text-muted
        focus:outline-none focus:ring-2 focus:ring-neumorphic-accent/30
        transition-all
        min-h-[44px]
        ${className}
      `}
      {...props}
    />
  );
}
