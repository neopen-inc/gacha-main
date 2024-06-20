 /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './lib/components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'md': 'rgb(189, 189, 189) 2px 0px 5px 3px'
      },
      colors: {
        primary: {
          DEFAULT: "#2a93D5",
        }
      }
      
    },
  },
  plugins: [],
}