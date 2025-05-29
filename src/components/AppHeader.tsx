import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useStore } from '../store/useStore';
import { stores } from '../api/client';
import { Image } from './Image';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors } from '../theme/colors';
import { fs } from '../utils/responsive';

type AppHeaderNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AppHeader = () => {
  const { currentStore, switchStore } = useStore();
  const [isDropdownVisible, setIsDropdownVisible] = React.useState(false);

  const handleStoreSelect = (storeId: string) => {
    switchStore(storeId);
    setIsDropdownVisible(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <Image source={require('../assets/logo.png')} width={100} height={40} />
        {/* <View style={styles.rightContent}>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.storeSelector}
              onPress={() => setIsDropdownVisible(!isDropdownVisible)}
            >
              <Text style={styles.currentStore}>{currentStore?.name || 'Select Store'}</Text>
              <Ionicons
                name={isDropdownVisible ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.primary[500]}
              />
            </TouchableOpacity>

            {isDropdownVisible && (
              <View style={styles.dropdown}>
                <FlatList
                  data={stores}
                  keyExtractor={item => item.url}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.dropdownItem,
                        currentStore?.url === item.url && styles.selectedItem,
                      ]}
                      onPress={() => handleStoreSelect(item.id)}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          currentStore?.url === item.url && styles.selectedItemText,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            {isAuthenticated && customer ? (
              <Avatar
                name={`${customer.firstName} ${customer.lastName}`}
                size={32}
                backgroundColor={colors.primary[500]}
              />
            ) : (
              <Ionicons name="person-circle-outline" size={24} color={colors.primary[500]} />
            )}
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    position: 'relative',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1001,
  },
  storeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.primary[0],
    gap: 4,
  },
  currentStore: {
    fontSize: fs(16),
    color: colors.primary[500],
    fontWeight: '500',
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: 200,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1002,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedItem: {
    backgroundColor: colors.primary[0],
  },
  dropdownItemText: {
    fontSize: fs(14),
    color: '#333',
  },
  selectedItemText: {
    color: colors.primary[500],
    fontWeight: '500',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[0],
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fs(16),
  },
  subtitle: {
    fontSize: fs(14),
  },
});
