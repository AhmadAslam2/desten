import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './typography/Typography';
import { colors } from '../theme/colors';
import { moderateScale } from '../utils/responsive';

interface BadgeProps {
  text?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  customText?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  leftIcon,
  rightIcon,
  backgroundColor = colors.primary[0],
  textColor = colors.black[100],
  style,
  customText,
}) => {
  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      {customText ? (
        customText
      ) : (
        <Typography variant="label" style={{ color: textColor }}>
          {text}
        </Typography>
      )}
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: moderateScale(4),
    paddingHorizontal: moderateScale(8),
    borderRadius: moderateScale(8),
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rightIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
