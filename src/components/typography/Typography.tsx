import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { fs } from '../../utils/responsive';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'pxs' | 'button' | 'label';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
}

const styles = StyleSheet.create({
  h1: {
    fontSize: fs(32),
    fontWeight: '700',
    fontFamily: 'Manrope-Bold',
  },
  h2: {
    fontSize: fs(24),
    fontWeight: '700',
    fontFamily: 'Manrope-Bold',
  },
  h3: {
    fontSize: fs(20),
    fontWeight: '600',
    fontFamily: 'Manrope-SemiBold',
  },
  h4: {
    fontSize: fs(18),
    fontWeight: '600',
    fontFamily: 'Manrope-SemiBold',
  },
  h5: {
    fontSize: fs(16),
    fontWeight: '600',
    fontFamily: 'Manrope-SemiBold',
  },
  p: {
    fontSize: fs(14),
    fontWeight: '400',
    fontFamily: 'Manrope-Regular',
  },
  pxs: {
    fontSize: fs(12),
    fontWeight: '400',
    fontFamily: 'Manrope-Regular',
  },
  button: {
    fontSize: fs(16),
    fontWeight: '500',
    fontFamily: 'Manrope-Medium',
  },
  label: {
    fontSize: fs(12),
    fontWeight: '400',
    fontFamily: 'Manrope-Regular',
  },
});

export const Typography: React.FC<TypographyProps> = ({
  variant = 'p',
  style,
  children,
  ...props
}) => {
  return (
    <Text style={[styles[variant], style]} {...props}>
      {children}
    </Text>
  );
};
