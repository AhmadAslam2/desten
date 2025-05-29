import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { moderateScale, horizontalScale } from '../utils/responsive';

interface ProductSliderProps {
  data: any[];
  renderItem: ({ item }: { item: any }) => React.ReactElement;
  width?: number;
  height?: number;
}
export const ProductSlider: React.FC<ProductSliderProps> = ({ data, renderItem, height = 300 }) => {
  return (
    <View style={[styles.container, { height }]}>
      <FlatList
        data={data}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={horizontalScale(255) + moderateScale(16)}
        decelerationRate="fast"
        snapToAlignment="start"
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  listContent: {
    paddingHorizontal: moderateScale(16),
  },
  separator: {
    width: moderateScale(16),
  },
});
