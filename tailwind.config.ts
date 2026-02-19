import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      colors: {
        // Accent colors using CSS custom properties
        accent: {
          purple: 'rgb(var(--color-accent-purple) / <alpha-value>)',
          indigo: 'rgb(var(--color-accent-indigo) / <alpha-value>)',
          blue: 'rgb(var(--color-accent-blue) / <alpha-value>)',
          pink: 'rgb(var(--color-accent-pink) / <alpha-value>)',
        },
        // Semantic colors
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        info: 'rgb(var(--color-info) / <alpha-value>)',
        // Galaxy theme colors
        galaxy: {
          enterprise: 'var(--color-galaxy-enterprise)',
          ai: 'var(--color-galaxy-ai)',
          fullstack: 'var(--color-galaxy-fullstack)',
          devtools: 'var(--color-galaxy-devtools)',
          creative: 'var(--color-galaxy-creative)',
          experimental: 'var(--color-galaxy-experimental)',
        },
        // Surface colors for dark theme
        surface: {
          1: 'rgb(255 255 255 / var(--surface-opacity-1))',
          2: 'rgb(255 255 255 / var(--surface-opacity-2))',
          3: 'rgb(255 255 255 / var(--surface-opacity-3))',
          4: 'rgb(255 255 255 / var(--surface-opacity-4))',
        },
      },
      fontSize: {
        // Map to CSS custom properties for consistency
        xs: ['var(--text-xs)', { lineHeight: 'var(--leading-normal)' }],
        sm: ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],
        base: ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
        lg: ['var(--text-lg)', { lineHeight: 'var(--leading-relaxed)' }],
        xl: ['var(--text-xl)', { lineHeight: 'var(--leading-snug)' }],
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-snug)' }],
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],
        '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-tight)' }],
        '5xl': ['var(--text-5xl)', { lineHeight: 'var(--leading-tight)' }],
        '6xl': ['var(--text-6xl)', { lineHeight: 'var(--leading-none)' }],
      },
      spacing: {
        // Extended spacing using CSS custom properties
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        'section-sm': 'var(--section-gap-sm)',
        'section-md': 'var(--section-gap-md)',
        'section-lg': 'var(--section-gap-lg)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      transitionDuration: {
        instant: 'var(--duration-instant)',
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        medium: 'var(--duration-medium)',
        slow: 'var(--duration-slow)',
        slower: 'var(--duration-slower)',
      },
      transitionTimingFunction: {
        'out-expo': 'var(--ease-out-expo)',
        'out-quint': 'var(--ease-out-quint)',
        'out-quart': 'var(--ease-out-quart)',
        'out-back': 'var(--ease-out-back)',
        'in-out-cubic': 'var(--ease-in-out-cubic)',
        magnetic: 'var(--ease-magnetic)',
        spring: 'var(--ease-spring)',
      },
      boxShadow: {
        'glow-purple': 'var(--shadow-glow-purple)',
        'glow-blue': 'var(--shadow-glow-blue)',
      },
      backdropBlur: {
        glass: 'var(--glass-blur)',
      },
      opacity: {
        'text-primary': 'var(--text-opacity-primary)',
        'text-secondary': 'var(--text-opacity-secondary)',
        'text-tertiary': 'var(--text-opacity-tertiary)',
        'text-muted': 'var(--text-opacity-muted)',
      },
    },
  },
  plugins: [],
}

export default config
