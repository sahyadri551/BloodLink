import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  fontFamily: {
    sans: ['Inter', 'sans-serif'], 
  },
  
  colors: {
    ...colors,
    primary: {
      50: colors.rose[50],
      100: colors.rose[100],
      200: colors.rose[200],
      300: colors.rose[300],
      400: colors.rose[400],
      500: colors.rose[500],
      600: colors.rose[600], 
      700: colors.rose[700],
      800: colors.rose[800],
      900: colors.rose[900],
      950: colors.rose[950],
    }
  }
}