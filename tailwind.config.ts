import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    {
      pattern: /^(m|p)[trblxy]?-(auto|[0-9.]+)$/,
    },
    {
      pattern: /^(w|h)-(full|screen|min|max|fit|[0-9./]+)$/,
    },
    {
      pattern: /^rounded(-[trbl]|-(tl|tr|bl|br))?-(none|sm|md|lg|xl|2xl|3xl|full)$/,
    },
    {
      pattern: /^(bg|text|border|from|to|via)-(primary|secondary|accent|muted|card|background|destructive|info|success|warning|blue|green|red|yellow|purple|orange|teal|white|black|transparent)$/,
      variants: ['hover'],
    },
    {
      pattern: /^(bg|text|border|from|to|via)-(primary|secondary|accent|muted|card|background|destructive|info|success|warning|blue|green|red|yellow|purple|orange|teal|white|black|transparent)\/[0-9]+$/,
      variants: ['hover'],
    },
    {
      pattern: /^bg-gradient-to-(t|tr|r|br|b|bl|l|tl)$/,
    },
    {
      pattern: /^shadow-(sm|md|lg|xl|2xl|inner|none)$/,
      variants: ['hover'],
    },
    {
      pattern: /^shadow-(primary|secondary|accent|muted|card|background|destructive|info|success|warning|blue|green|red|yellow|purple|orange|teal|white|black|transparent)\/[0-9]+$/,
      variants: ['hover'],
    },
    {
      pattern: /^opacity-[0-9]+$/,
      variants: ['hover'],
    },
    {
      pattern: /^(backdrop-blur|blur)-(none|sm|md|lg|xl|2xl|3xl)$/,
    },
    {
      pattern: /^(transition|duration|ease|delay)-(all|colors|opacity|shadow|transform|[0-9]+)$/,
    },
    {
      pattern: /^(scale|rotate|translate)-(0|50|75|90|95|100|105|110|125|150)$/,
      variants: ['hover'],
    },
    {
        pattern: /^border(-[trbl])?(-[0-9])?$/,
    }
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-inter)', 'sans-serif'],
        headline: ['var(--font-space-grotesk)', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'hsl(var(--info) / <alpha-value>)',
          foreground: 'hsl(var(--info-foreground) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'hsl(var(--success) / <alpha-value>)',
          foreground: 'hsl(var(--success-foreground) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning) / <alpha-value>)',
          foreground: 'hsl(var(--warning-foreground) / <alpha-value>)',
        },
        blue: {
          DEFAULT: 'hsl(var(--blue) / <alpha-value>)',
          foreground: 'hsl(var(--blue-foreground) / <alpha-value>)',
        },
        green: {
          DEFAULT: 'hsl(var(--green) / <alpha-value>)',
          foreground: 'hsl(var(--green-foreground) / <alpha-value>)',
        },
        red: {
          DEFAULT: 'hsl(var(--red) / <alpha-value>)',
          foreground: 'hsl(var(--red-foreground) / <alpha-value>)',
        },
        yellow: {
          DEFAULT: 'hsl(var(--yellow) / <alpha-value>)',
          foreground: 'hsl(var(--yellow-foreground) / <alpha-value>)',
        },
        purple: {
          DEFAULT: 'hsl(var(--purple) / <alpha-value>)',
          foreground: 'hsl(var(--purple-foreground) / <alpha-value>)',
        },
        orange: {
          DEFAULT: 'hsl(var(--orange) / <alpha-value>)',
          foreground: 'hsl(var(--orange-foreground) / <alpha-value>)',
        },
        teal: {
          DEFAULT: 'hsl(var(--teal) / <alpha-value>)',
          foreground: 'hsl(var(--teal-foreground) / <alpha-value>)',
        },
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config;
