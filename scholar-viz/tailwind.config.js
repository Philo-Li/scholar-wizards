/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        sunk: 'var(--paper-sunk)',
        ink: 'var(--ink)',
        ink2: 'var(--ink-2)',
        ink3: 'var(--ink-3)',
        rule: 'var(--rule)',
        rulestrong: 'var(--rule-strong)',
        link: 'var(--link)',
        s1: 'var(--series-1)',
        s2: 'var(--series-2)',
        mark: 'var(--mark)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Noto Serif SC', 'Songti SC', 'SimSun', 'serif'],
        sans: ['var(--font-sans)', 'PingFang SC', 'Microsoft YaHei', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
        page: '1180px',
      },
    },
  },
  plugins: [],
};
