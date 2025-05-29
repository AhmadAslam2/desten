import React, { useState } from 'react';
import { getColors, ImageColorsResult } from 'react-native-image-colors';
import { colors } from '../theme/colors';

export const useImageColors = (url: string) => {
  const [extractedColors, setExtractedColors] = useState<any | null>(null);

  React.useEffect(() => {
    if (!url) return;

    getColors(url, {
      fallback: colors.primary[100],
      cache: true,
      key: url,
    }).then(setExtractedColors);
  }, [url]);

  return extractedColors;
};
