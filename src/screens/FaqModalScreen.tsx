import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '../theme/colors';
import { moderateScale } from '../utils/responsive';
import { useNavigation } from '@react-navigation/native';

export const FaqModalScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <WebView source={{ uri: 'https://faq.terd.de/de-DE' }} style={styles.webview} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.primary[100],
    backgroundColor: colors.ui.background,
    zIndex: 2,
  },
  closeBtn: {
    marginRight: moderateScale(12),
    padding: moderateScale(4),
  },
  title: {
    color: colors.primary[500],
  },
  webview: {
    flex: 1,
  },
});

export default FaqModalScreen;
