import React from 'react';
import { View, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface SvgIconProps extends SvgProps {
  icon: React.ComponentType<SvgProps>;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const SvgIcon: React.FC<SvgIconProps> = ({
  icon: Icon,
  size = 24,
  color,
  style,
  ...props
}) => {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Icon width={size} height={size} color={color} {...props} />
    </View>
  );
};
