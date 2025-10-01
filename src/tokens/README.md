# Design Token System

This directory contains a comprehensive design token system for consistent styling across the application.

## Overview

The design token system provides:
- **Colors**: Primary, secondary, semantic (success, warning, error), and neutral color palettes
- **Typography**: Font families, sizes, weights, line heights, and letter spacing
- **Spacing**: Consistent spacing scale for margins, padding, and layout
- **Border Radius**: Rounded corner values
- **Shadows**: Box shadow definitions
- **Animation**: Duration and timing function values
- **Breakpoints**: Responsive design breakpoints
- **Z-Index**: Layering values
- **Component Tokens**: Pre-configured styles for common components

## Files

### `design-tokens.ts`
TypeScript definitions for all design tokens. Use this for type-safe access to design values in React components.

### `design-tokens.css`
CSS custom properties for all design tokens. These are automatically available in all stylesheets.

### `token-utils.ts`
Utility functions and helpers for working with design tokens in TypeScript/React.

## Usage Examples

### Using CSS Custom Properties

```css
.my-component {
  background-color: var(--color-primary-500);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
}
```

### Using TypeScript Tokens

```tsx
import { getColor, getSpacing, theme } from '../tokens/token-utils';

function MyComponent() {
  return (
    <div
      style={{
        backgroundColor: getColor('primary', 500),
        padding: getSpacing(4),
        borderRadius: theme.borderRadius.md,
      }}
    >
      Content
    </div>
  );
}
```

### Using with Tailwind CSS Classes

```tsx
import { tw } from '../tokens/token-utils';

function MyComponent() {
  return (
    <div className={`
      ${tw.bg('primary', 500)} 
      ${tw.p(4)} 
      ${tw.rounded('md')}
      ${tw.shadow('md')}
    `}>
      Content
    </div>
  );
}
```

### Using Semantic Theme Colors

```tsx
function MyComponent() {
  return (
    <div style={{ 
      backgroundColor: 'var(--background)',
      color: 'var(--foreground)',
      borderColor: 'var(--border)',
    }}>
      This automatically adapts to light/dark themes
    </div>
  );
}
```

## Color Palette

### Primary Colors
Used for main brand elements, CTAs, and primary actions.
- `primary-50` to `primary-950` (lightest to darkest)

### Secondary Colors
Used for supporting elements and neutral states.
- `secondary-50` to `secondary-950`

### Semantic Colors
- **Success**: `success-50` to `success-900` (green palette)
- **Warning**: `warning-50` to `warning-900` (yellow/orange palette)  
- **Error**: `error-50` to `error-900` (red palette)

### Neutral Colors
Used for text, borders, and backgrounds.
- `neutral-50` to `neutral-950`

## Typography Scale

### Font Families
- `sans`: Inter, system-ui, sans-serif
- `mono`: JetBrains Mono, Menlo, Monaco, monospace
- `serif`: Georgia, serif

### Font Sizes
- `xs`: 0.75rem (12px)
- `sm`: 0.875rem (14px)  
- `base`: 1rem (16px)
- `lg`: 1.125rem (18px)
- `xl`: 1.25rem (20px)
- `2xl` to `9xl`: Progressively larger sizes

### Font Weights
- `thin` (100) to `black` (900)

## Spacing Scale

Based on a 0.25rem (4px) base unit:
- `1`: 0.25rem (4px)
- `2`: 0.5rem (8px)
- `4`: 1rem (16px)
- `6`: 1.5rem (24px)
- `8`: 2rem (32px)
- And so on...

## Dark Mode Support

The system includes built-in dark mode support through:

1. **CSS Media Query**: Automatically detects system preference
2. **Class-based**: Add `dark` class to any element for manual control

Semantic theme colors automatically adapt:
- `--background` / `--foreground`
- `--muted` / `--muted-foreground`
- `--border` / `--input`
- `--accent` / `--accent-foreground`

## Component Integration

### Pre-configured Component Tokens

```tsx
import { theme } from '../tokens/token-utils';

// Button component using pre-configured tokens
const buttonStyle = {
  padding: `${theme.components.button.paddingY.md} ${theme.components.button.paddingX.md}`,
  fontSize: theme.components.button.fontSize.md,
  borderRadius: theme.components.button.borderRadius,
};
```

### Custom Components

```tsx
// Card component
function Card({ children }) {
  return (
    <div style={{
      padding: theme.components.card.padding,
      borderRadius: theme.components.card.borderRadius,
      boxShadow: theme.components.card.shadow,
      backgroundColor: theme.colors.background,
    }}>
      {children}
    </div>
  );
}
```

## Responsive Design

Use breakpoint tokens for consistent responsive behavior:

```tsx
import { media } from '../tokens/token-utils';

const styles = {
  container: {
    padding: '1rem',
    
    [media.md]: {
      padding: '2rem',
    },
    
    [media.lg]: {
      padding: '3rem',
    },
  },
};
```

## Best Practices

1. **Always use tokens**: Avoid hardcoded values
2. **Prefer semantic colors**: Use theme colors for automatic dark mode support
3. **Use spacing scale**: Stick to the defined spacing values
4. **Leverage utilities**: Use the helper functions for type safety
5. **Component consistency**: Use component tokens for repeated patterns

## Extending the System

To add new tokens:

1. Update `design-tokens.ts` with new values
2. Add corresponding CSS custom properties in `design-tokens.css`
3. Create utility functions in `token-utils.ts` if needed
4. Update this documentation

## Integration with Tailwind CSS

The tokens are designed to work seamlessly with Tailwind CSS. You can:

1. Use Tailwind classes directly: `bg-primary-500 text-white p-4`
2. Extend Tailwind config with custom tokens
3. Use CSS custom properties in Tailwind: `bg-[var(--color-primary-500)]`