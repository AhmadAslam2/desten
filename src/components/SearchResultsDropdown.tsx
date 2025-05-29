import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { moderateScale } from '../utils/responsive';

interface SearchResultsDropdownProps<T> {
  results: T[];
  renderItem: (item: T) => React.ReactNode;
  visible: boolean;
  containerStyle?: ViewStyle;
  itemStyle?: ViewStyle;
  onItemPress?: (item: T) => void;
  scrollViewStyle?: ViewStyle;
}

export const SearchResultsDropdown = <T,>({
  results,
  renderItem,
  visible,
  containerStyle,
  itemStyle,
  onItemPress,
  scrollViewStyle,
}: SearchResultsDropdownProps<T>) => {
  if (!visible || results.length === 0) return null;

  return (
    <View style={[styles.container, containerStyle]} pointerEvents="box-none">
      <ScrollView
        style={[styles.scrollView, scrollViewStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {results.map((item, index) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onItemPress?.(item)}
            key={index}
            style={[styles.resultItem, itemStyle]}
          >
            {renderItem(item)}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.ui.background,
    borderRadius: moderateScale(16),
    marginTop: moderateScale(4),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    overflow: 'hidden',
  },
  scrollView: {
    maxHeight: moderateScale(255),
  },
  resultItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.primary[100],
  },
});
