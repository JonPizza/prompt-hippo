import type { Config } from 'tailwindcss'
import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-green-300',
    'bg-orange-300',
    'bg-purple-300'
  ],
  plugins: [daisyui, typography],
  daisyui: {
    themes: ["emerald"],
  },
}
export default config
