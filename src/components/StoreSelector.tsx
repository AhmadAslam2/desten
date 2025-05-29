import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useStore } from '../store/useStore';
import { Typography } from './typography/Typography';
import { useTranslation } from '../store/useTranslation';

export const StoreSelector = () => {
  const { stores, currentStore, switchStore } = useStore();
  const { t } = useTranslation();

  if (stores.length === 0) {
    return (
      <View style={styles.container}>
        <Typography variant="p">{t('store.noStoresAvailable')}</Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Typography variant="h2" style={styles.title}>
        {t('store.selectStore')}
      </Typography>
      {stores.map(store => (
        <TouchableOpacity
          key={store.id}
          style={[styles.storeButton, currentStore?.id === store.id && styles.activeStore]}
          onPress={() => switchStore(store.id)}
        >
          <Typography variant="p" style={styles.storeName}>
            {store.name}
          </Typography>
          <Typography variant="pxs" style={styles.storeUrl}>
            {store.url}
          </Typography>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  storeButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  activeStore: {
    backgroundColor: '#e0e0e0',
  },
  storeName: {
    fontWeight: '600',
  },
  storeUrl: {
    color: '#666',
    marginTop: 4,
  },
});
