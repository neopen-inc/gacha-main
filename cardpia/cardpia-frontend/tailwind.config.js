 /** @type {import('tailwindcss').Config} */

 module.exports = {
  content: [
    './lib/components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      extend: {
        aspectRatio: {
          '4/3': '4 / 3',
          '7/6': '7 / 6',
        },
      },
      colors: {
        primary: {
          DEFAULT: '#ffff84',
          200: '#dceeec',
        },
        frontPrimary: {
          DEFAULT: 'black',
        },
        secondary: {
          DEFAULT: '#7e8e8f',
        },
        orange: {
          DEFAULT: '#CB794A',
        },
        sitedark: {
          DEFAULT: '#031015',
        },
        sidered: {
          DEFAULT: '#C43A31',
        },
        sidegray: {
          DEFAULT: '#1C1C1C',
        },
        sideorange: {
          DEFAULT: '#D2C09B',
        },
        
        gachaOne: {
          DEFAULT: '#404247',
        },
        selectedGray: {
          DEFAULT: '#A5A5A5',
        },
        pointColor: {
          DEFAULT: '#DFA975',
        },
        menuOrange: {
          DEFAULT: '#D9743E',
        },
        foregroundOrange: {
          DEFAULT: '#D9743E',
        },
        backgroundOrange: {
          DEFAULT: '#f9ebe1',
        },
        oripaOrange: {
          DEFAULT: '#DFA97B',
        },
        breadred: {
          DEFAULT: '#D48A86',
        },
        breadyellow: {
          DEFAULT: '#F6E380',
        },
        gachaButtonOrange: {
          DEFAULT: '#F4A641',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'md': 'rgb(189, 189, 189) 2px 0px 5px 3px'
      }
    },
  },
  plugins: [],
}
