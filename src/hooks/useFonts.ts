import { useCallback, useEffect, useState } from 'react';
import * as Font from 'expo-font';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = useCallback(async () => {
    try {
      await Font.loadAsync({
        'Manrope-Regular': require('../../assets/fonts/Manrope-Regular.ttf'),
        'Manrope-Medium': require('../../assets/fonts/Manrope-Medium.ttf'),
        'Manrope-SemiBold': require('../../assets/fonts/Manrope-SemiBold.ttf'),
        'Manrope-Bold': require('../../assets/fonts/Manrope-Bold.ttf'),
      });
      setFontsLoaded(true);
    } catch (error) {
      console.error('Error loading fonts:', error);
    }
  }, []);

  useEffect(() => {
    loadFonts();
  }, [loadFonts]);

  return fontsLoaded;
}; 