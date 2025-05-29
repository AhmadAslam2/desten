import { RFValue } from 'react-native-responsive-fontsize';
import { Dimensions } from 'react-native';
import { ms } from 'react-native-size-matters';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BASE_WIDTH = 375; // Figma base width
const BASE_HEIGHT = 875; // Figma base height
export const horizontalScale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;
export const verticalScale = (size: number) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
export const moderateScale = (size: number) => ms(size, 0.1);
// Scale font size responsively
export const fs = (size: number) => {
  return RFValue(size, 875);
};

// Common font sizes
export const fontSize = {
  xs: fs(12),
  sm: fs(14),
  md: fs(16),
  lg: fs(18),
  xl: fs(20),
  xxl: fs(24),
  xxxl: fs(32),
};
