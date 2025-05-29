import React, { useRef } from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps,
  StyleSheet,
  Pressable,
} from 'react-native';
import { fs } from '../../utils/responsive';
import { colors } from '../../theme/colors';

interface CustomTextInputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: any;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  ...props
}) => {
  const inputRef = useRef<RNTextInput>(null);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  return (
    <Pressable onPress={handlePress} style={[styles.container, containerStyle]}>
      {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
      <RNTextInput
        ref={inputRef}
        style={[styles.input, style]}
        placeholderTextColor={colors.grey[300]}
        {...props}
      />
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  icon: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: fs(16),
    color: '#222',
    paddingVertical: 0,
  },
});

export default CustomTextInput;
