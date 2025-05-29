import React from 'react';
import { View, StyleSheet, Pressable, PressableProps } from 'react-native';
import { colors } from '../theme/colors';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Typography } from './typography/Typography';
import {
  HomeIcon,
  SearchIcon,
  CategoryIcon,
  ShopIcon,
  BuyAgainIcon,
  PersonIcon,
} from '../assets/icons';

type TabBarItemProps = Omit<BottomTabBarButtonProps, 'children'> & {
  label?: string;
  isFocused?: boolean;
};

const getIconForLabel = (label: string) => {
  const normalizedLabel = label.toLowerCase().trim();
  switch (normalizedLabel) {
    case 'home':
      return HomeIcon;
    case 'search':
      return SearchIcon;
    case 'category':
    case 'categories':
      return CategoryIcon;
    case 'shop':
      return ShopIcon;
    case 'buy again':
    case 'buyagain':
      return BuyAgainIcon;
    case 'profile':
      return PersonIcon;
    default:
      return HomeIcon;
  }
};

export const TabBarItem: React.FC<TabBarItemProps> = ({
  label,
  isFocused,
  onPress,
  accessibilityState,
  ...props
}) => {
  const focused = isFocused ?? accessibilityState?.selected;
  const Icon = label ? getIconForLabel(label) : HomeIcon;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      accessibilityState={accessibilityState}
      accessibilityLabel={props.accessibilityLabel}
      testID={props.testID}
    >
      <View style={styles.content}>
        <Icon width={24} height={24} stroke={colors.primary[500]} fill="none" />
        <Typography variant="label" style={[styles.label]}>
          {label}
        </Typography>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    marginTop: 4,
    color: colors.primary[500],
  },
  pressed: {
    opacity: 0.7,
  },
});
