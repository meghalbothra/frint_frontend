import React from 'react';
import { glassEffect } from '../../styles/glass';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div className={`
      ${glassEffect.background}
      ${glassEffect.border}
      ${glassEffect.shadow}
      ${glassEffect.hover}
      rounded-lg transition-all duration-300
      ${className}
    `}>
      {children}
    </div>
  );
}