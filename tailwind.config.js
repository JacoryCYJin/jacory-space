/** @type {import('tailwindcss').Config} */
import tailwindForms from '@tailwindcss/forms';
import tailwindTypography from '@tailwindcss/typography';

const config =  {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 使用class策略而不是media查询
  theme: {
    extend: {
      colors: {
        // 您可以在这里添加自定义颜色
        primary: {
          light: '#faf9f7',
          dark: '#0a0a0a',
        },
        secondary: {
          light: '#171717',
          dark: '#ededed',
        },
      },
      fontFamily: {
        // 您可以在这里添加自定义字体
        sans: ['var(--font-geist-sans)', 'Arial', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [
    tailwindForms,
    tailwindTypography,
  ],
}

export default config;