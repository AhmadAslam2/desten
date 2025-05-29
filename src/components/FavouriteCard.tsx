import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View, ImageSourcePropType } from 'react-native';
import { Typography } from './typography/Typography';
import { horizontalScale, moderateScale, verticalScale } from '../utils/responsive';

interface FavouriteCardProps {
  icon: React.ReactNode;
  text: string;
  onPress?: () => void;
}

const FavouriteCard: React.FC<FavouriteCardProps> = ({ icon, text, onPress }) => {
  return (
    <TouchableOpacity style={styles.favouriteButton} onPress={onPress}>
      {icon}
      <Typography variant="p" style={styles.favouriteText}>
        {text}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  favouriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: moderateScale(16),
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  favouriteText: {
    marginLeft: horizontalScale(16),
  },
});

export default FavouriteCard;
