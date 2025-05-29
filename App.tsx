import { StatusBar } from 'expo-status-bar';
import { useFonts } from './src/hooks/useFonts';
import { ApolloProvider } from '@apollo/client';
import { ProductsScreen } from './src/screens/ProductsScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from './src/types/navigation';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { createApolloClient } from './src/api/client';
import { useStore } from './src/store/useStore';
import { stores } from './src/config/stores';
import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useStoreInitialization } from './src/hooks/useStoreInitialization';
import { View, ActivityIndicator } from 'react-native';
import { colors, NavigationTheme } from './src/theme/colors';
import { ShopifyCheckoutSheetProvider } from '@shopify/checkout-sheet-kit';
import { CustomTabBar } from './src/components/CustomTabBar';
import { HomeScreen } from './src/screens/HomeScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import ShopScreen from './src/screens/ShopScreen';
import { AccountDetailsScreen } from './src/screens/AccountDetailsScreen';
import { FaqModalScreen } from './src/screens/FaqModalScreen';
import { useAuth } from './src/store/useAuth';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Category"
        component={CategoriesScreen}
        options={{
          tabBarLabel: 'Category',
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          tabBarLabel: 'Shop',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={isAuthenticated ? ProfileScreen : LoginScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const AppContent = () => {
  return (
    <NavigationContainer theme={NavigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="AccountDetails" component={AccountDetailsScreen} />
        <Stack.Screen
          name="FaqModal"
          component={FaqModalScreen}
          options={{ presentation: 'modal', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AppWithProviders = () => {
  const { currentStore } = useStore();
  const { isLoading } = useStoreInitialization();
  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    };
    if (!isLoading) {
      prepare();
    }
  }, [isLoading]);

  const client = React.useMemo(() => {
    const storeUrl = currentStore?.url || stores[0].url;
    const accessToken = currentStore?.accessToken || stores[0].accessToken;
    return createApolloClient(storeUrl, accessToken);
  }, [currentStore]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.ui.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <ApolloProvider client={client}>
      <ShopifyCheckoutSheetProvider>
        <AppContent />
        <StatusBar style="auto" />
      </ShopifyCheckoutSheetProvider>
    </ApolloProvider>
  );
};

export default function App() {
  const fontsLoaded = useFonts();
  if (!fontsLoaded) {
    return null;
  }

  return <AppWithProviders />;
}
