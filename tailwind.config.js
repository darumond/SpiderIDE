module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['poppins'],
      },
      padding: {
        'nav-pad': '10px',
      },
      gap: {
        'nav-gap': '1.25rem',
      },
      colors: {
        primary: {
          light: '#3C3C4A',
          main: '#24272E',
          dark: '#1F2228',
          contrastText: '#fff',
        },
        secondary: {
          light: '#9099AC',
          main: '#C4CBDA',
          dark: '#31343D',
          contrastText: '#000',
        },
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        '16': 'repeat(16, minmax(0, 1fr))'
      }
    },
  },
  variants: {},
  plugins: [],
};
