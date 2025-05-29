import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Typography } from './typography/Typography';
import { colors } from '../theme/colors';
import { fs, horizontalScale, verticalScale } from '../utils/responsive';
import { BlurView } from '@react-native-community/blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export const LockedProductOverlay = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={10}
        reducedTransparencyFallbackColor={colors.primary[900]}
      />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed" size={horizontalScale(32)} color={colors.primary[0]} />
        </View>
        <Typography variant="h2" style={styles.title}>
          Product Locked
        </Typography>
        <Typography variant="p" style={styles.description}>
          This product is currently locked in your region. Please contact support for more
          information.
        </Typography>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Typography variant="button" style={styles.buttonText}>
            Go Back
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: horizontalScale(24),
    alignItems: 'center',
    maxWidth: horizontalScale(320),
  },
  iconContainer: {
    width: horizontalScale(80),
    height: verticalScale(80),
    borderRadius: 40,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  title: {
    color: colors.primary[0],
    textAlign: 'center',
    marginBottom: verticalScale(16),
  },
  description: {
    color: colors.primary[100],
    textAlign: 'center',
    fontSize: fs(16),
    lineHeight: 24,
    marginBottom: verticalScale(32),
  },
  button: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(8),
    borderRadius: 12,
    minWidth: horizontalScale(100),
    alignItems: 'center',
  },
  buttonText: {
    color: colors.primary[0],
    fontSize: fs(16),
    fontWeight: '600',
  },
});
