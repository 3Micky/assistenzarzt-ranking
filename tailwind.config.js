/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas:     '#F4F4F0',
        'canvas-alt': '#EAE8E3',
        ink:        '#050505',
        hazard:     '#E61919',
        'score-low':  '#EF4444',
        'score-mid':  '#F59E0B',
        'score-high': '#22C55E',
      },
      fontFamily: {
        display: ['"Archivo Black"', 'Inter', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
        none:    '0px',
        sm:      '0px',
        md:      '0px',
        lg:      '0px',
        xl:      '0px',
        '2xl':   '0px',
        full:    '0px',
      },
      letterSpacing: {
        widest: '0.12em',
        wider:  '0.08em',
      },
    },
  },
  plugins: [],
}
