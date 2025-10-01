/**
 * Example Component - Design Tokens Demo
 * 
 * This component demonstrates how to use the design tokens in React components
 * using both CSS custom properties and TypeScript utilities.
 */

import React from 'react';
import { getColor, getSpacing, theme, tw } from '../tokens/token-utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

// Example Button component using design tokens
export function Button({ variant = 'primary', size = 'md', children, onClick }: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-400',
    secondary: 'bg-secondary-800 text-white hover:bg-secondary-700 focus:ring-secondary-600 border border-secondary-600',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
    warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500',
    error: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Example Card component using CSS custom properties
export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div 
      className={`rounded-lg border bg-card text-card-foreground shadow-md ${className}`}
      style={{
        padding: 'var(--spacing-6)',
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-md)',
        borderRadius: 'var(--border-radius-lg)',
      }}
    >
      {children}
    </div>
  );
}

// Example Typography components
export function Heading({ level = 1, children, className = '' }: { 
  level?: 1 | 2 | 3 | 4 | 5 | 6; 
  children: React.ReactNode; 
  className?: string;
}) {
  const styles = {
    1: 'text-4xl font-bold tracking-tight',
    2: 'text-3xl font-semibold tracking-tight',
    3: 'text-2xl font-semibold tracking-tight',
    4: 'text-xl font-semibold tracking-tight',
    5: 'text-lg font-medium tracking-tight',
    6: 'text-base font-medium tracking-tight',
  };
  
  const commonProps = {
    className: `${styles[level]} ${className}`,
    children,
  };
  
  switch (level) {
    case 1: return <h1 {...commonProps} />;
    case 2: return <h2 {...commonProps} />;
    case 3: return <h3 {...commonProps} />;
    case 4: return <h4 {...commonProps} />;
    case 5: return <h5 {...commonProps} />;
    case 6: return <h6 {...commonProps} />;
    default: return <h1 {...commonProps} />;
  }
}

export function Text({ size = 'base', weight = 'normal', children, className = '' }: {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
  className?: string;
}) {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };
  
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };
  
  return (
    <p className={`${sizeClasses[size]} ${weightClasses[weight]} ${className}`}>
      {children}
    </p>
  );
}

// Example showcasing different ways to use design tokens
export function DesignTokensDemo() {
  return (
    <div className="min-h-screen bg-black text-white p-8 space-y-8">
      <div>
        <Heading level={1} className="text-white">ArtRiot Design System</Heading>
        <Text size="lg" className="text-gray-400 mt-2">
          Black-dominant aesthetic with vibrant pink and clean white highlights.
        </Text>
      </div>
      
      {/* Button Examples */}
      <section>
        <Heading level={2}>Buttons</Heading>
        <div className="flex flex-wrap gap-4 mt-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="error">Error</Button>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>
      
      {/* Card Examples */}
      <section>
        <Heading level={2} className="text-white">Cards</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-secondary-900 border border-secondary-700 rounded-lg p-6">
            <Heading level={3} className="text-primary-500">Featured Card</Heading>
            <Text className="mt-2 text-gray-300">
              This card showcases the black theme with pink highlights and subtle gray borders.
            </Text>
          </div>
          <div className="bg-secondary-800 border border-secondary-600 rounded-lg p-6">
            <Heading level={3} className="text-white">Standard Card</Heading>
            <Text className="mt-2 text-gray-400">
              Clean design with consistent spacing and elegant contrast.
            </Text>
          </div>
        </div>
      </section>
      
      {/* Typography Examples */}
      <section>
        <Heading level={2} className="text-white">Typography</Heading>
        <div className="space-y-4 mt-4">
          <Heading level={1} className="text-primary-500">ArtRiot Heading 1</Heading>
          <Heading level={2} className="text-white">Clean Heading 2</Heading>
          <Heading level={3} className="text-gray-200">Subtle Heading 3</Heading>
          <Text size="xl" weight="semibold" className="text-primary-400">Large Pink Text</Text>
          <Text size="lg" className="text-white">Large White Text</Text>
          <Text size="base" className="text-gray-300">Base Gray Text</Text>
          <Text size="sm" className="text-gray-500">Small Muted Text</Text>
        </div>
      </section>
      
      {/* Color Palette */}
      <section>
        <Heading level={2}>Color Palette</Heading>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
          {['primary', 'secondary', 'success', 'warning', 'error'].map((color) => (
            <div key={color} className="space-y-2">
              <Text size="sm" weight="medium" className="capitalize">{color}</Text>
              <div className="space-y-1">
                {[100, 300, 500, 700, 900].map((shade) => (
                  <div
                    key={shade}
                    className={`h-8 rounded border`}
                    style={{ backgroundColor: `var(--color-${color}-${shade})` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Spacing Examples */}
      <section>
        <Heading level={2}>Spacing Scale</Heading>
        <div className="space-y-2 mt-4">
          {[1, 2, 4, 6, 8, 12, 16, 24].map((space) => (
            <div key={space} className="flex items-center gap-4">
              <Text size="sm" className="w-12">{space}</Text>
              <div 
                className="bg-primary-500 rounded"
                style={{ 
                  width: `var(--spacing-${space})`, 
                  height: 'var(--spacing-4)' 
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}