import { ReactNode } from 'react';

interface NeumorphicCardProps {
  children: ReactNode;
  className?: string;
}

export default function NeumorphicCard({ children, className = '' }: NeumorphicCardProps) {
  return (
    <div className={`neumorphic-raised rounded-2xl p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
}
