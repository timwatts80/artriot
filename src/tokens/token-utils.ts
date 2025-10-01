/**
 * Design System Token Utilities
 * 
 * Utility functions and hooks for using design tokens in React components.
 */

import { tokens } from './design-tokens';

// Type definitions for better TypeScript support
export type ColorScale = keyof typeof tokens.colors;
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
export type SpacingValue = keyof typeof tokens.spacing;
export type FontSize = keyof typeof tokens.typography.fontSize;
export type FontWeight = keyof typeof tokens.typography.fontWeight;
export type BorderRadius = keyof typeof tokens.borderRadius;
export type BoxShadow = keyof typeof tokens.boxShadow;

/**
 * Get a color value from the design tokens
 * @param scale - The color scale (e.g., 'primary', 'secondary')
 * @param shade - The shade (e.g., 50, 100, 500, 900)
 * @returns The hex color value
 */
export function getColor(scale: ColorScale, shade: ColorShade): string {
  const colorScale = tokens.colors[scale] as Record<ColorShade, string>;
  return colorScale[shade];
}

/**
 * Get a spacing value from the design tokens
 * @param value - The spacing key
 * @returns The spacing value in rem or px
 */
export function getSpacing(value: SpacingValue): string {
  return tokens.spacing[value];
}

/**
 * Get a font size configuration from the design tokens
 * @param size - The font size key
 * @returns The font size configuration [size, lineHeight]
 */
export function getFontSize(size: FontSize): readonly [string, { readonly lineHeight: string }] {
  return tokens.typography.fontSize[size];
}

/**
 * Get a font weight value from the design tokens
 * @param weight - The font weight key
 * @returns The font weight value
 */
export function getFontWeight(weight: FontWeight): string {
  return tokens.typography.fontWeight[weight];
}

/**
 * Get a border radius value from the design tokens
 * @param radius - The border radius key
 * @returns The border radius value
 */
export function getBorderRadius(radius: BorderRadius): string {
  return tokens.borderRadius[radius];
}

/**
 * Get a box shadow value from the design tokens
 * @param shadow - The box shadow key
 * @returns The box shadow value
 */
export function getBoxShadow(shadow: BoxShadow): string {
  return tokens.boxShadow[shadow];
}

/**
 * Generate CSS custom property name for a color
 * @param scale - The color scale
 * @param shade - The shade
 * @returns CSS custom property name
 */
export function getColorVar(scale: ColorScale, shade: ColorShade): string {
  return `var(--color-${scale}-${shade})`;
}

/**
 * Generate CSS custom property name for spacing
 * @param value - The spacing value
 * @returns CSS custom property name
 */
export function getSpacingVar(value: SpacingValue): string {
  const varName = value.toString().replace('.', '-');
  return `var(--spacing-${varName})`;
}

/**
 * Theme utility functions
 */
export const theme = {
  // Quick access to common semantic colors
  colors: {
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    muted: 'var(--muted)',
    mutedForeground: 'var(--muted-foreground)',
    border: 'var(--border)',
    input: 'var(--input)',
    ring: 'var(--ring)',
    accent: 'var(--accent)',
    accentForeground: 'var(--accent-foreground)',
    destructive: 'var(--destructive)',
    destructiveForeground: 'var(--destructive-foreground)',
  },
  
  // Quick access to component tokens
  button: tokens.components.button,
  input: tokens.components.input,
  card: tokens.components.card,
  
  // Responsive breakpoints
  breakpoints: tokens.breakpoints,
  
  // Animation values
  animation: tokens.animation,
  
  // Z-index values
  zIndex: tokens.zIndex,
};

/**
 * Responsive design utilities
 */
export const media = {
  sm: `@media (min-width: ${tokens.breakpoints.sm})`,
  md: `@media (min-width: ${tokens.breakpoints.md})`,
  lg: `@media (min-width: ${tokens.breakpoints.lg})`,
  xl: `@media (min-width: ${tokens.breakpoints.xl})`,
  '2xl': `@media (min-width: ${tokens.breakpoints['2xl']})`,
};

/**
 * Generate Tailwind CSS classes using design tokens
 */
export const tw = {
  // Color utilities
  bg: (scale: ColorScale, shade: ColorShade) => `bg-${scale}-${shade}`,
  textColor: (scale: ColorScale, shade: ColorShade) => `text-${scale}-${shade}`,
  border: (scale: ColorScale, shade: ColorShade) => `border-${scale}-${shade}`,
  
  // Spacing utilities
  p: (value: SpacingValue) => `p-${value}`,
  px: (value: SpacingValue) => `px-${value}`,
  py: (value: SpacingValue) => `py-${value}`,
  m: (value: SpacingValue) => `m-${value}`,
  mx: (value: SpacingValue) => `mx-${value}`,
  my: (value: SpacingValue) => `my-${value}`,
  
  // Typography utilities
  textSize: (size: FontSize) => `text-${size}`,
  font: (weight: FontWeight) => `font-${weight}`,
  
  // Border radius utilities
  rounded: (radius: BorderRadius) => radius === 'default' ? 'rounded' : `rounded-${radius}`,
  
  // Shadow utilities
  shadow: (shadow: BoxShadow) => shadow === 'default' ? 'shadow' : `shadow-${shadow}`,
};

export default tokens;