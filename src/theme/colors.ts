import { DefaultTheme } from '@react-navigation/native';

export const colors = {
  primary: {
    0: '#EEF8FA',
    100: '#DEF2F7',
    200: '#7AC6DA',
    300: '#52AFC8',
    400: '#2998B5',
    500: '#0081A3',
    600: '#006782',
    700: '#004D62',
    800: '#003441',
    900: '#001A21',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#AFAFAF',
    400: '#6B6B6B',
    500: '#565656',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  black: {
    100: '#1B1B1B',
    90: 'rgba(0, 0, 0, 0.9)',
    80: 'rgba(0, 0, 0, 0.8)',
    70: 'rgba(0, 0, 0, 0.7)',
    60: 'rgba(0, 0, 0, 0.6)',
    50: 'rgba(0, 0, 0, 0.5)',
    40: 'rgba(0, 0, 0, 0.4)',
    30: 'rgba(0, 0, 0, 0.3)',
    20: 'rgba(0, 0, 0, 0.2)',
    10: 'rgba(0, 0, 0, 0.1)',
    5: 'rgba(0, 0, 0, 0.05)',
  },
  // Common semantic colors that can be added later
  semantic: {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3',
  },
  // Common UI colors that can be added later
  ui: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: {
      primary: '#000000',
      secondary: '#757575',
      disabled: '#9E9E9E',
    },
  },
};
export const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.ui.background, // Replace with your desired background color
  },
};
