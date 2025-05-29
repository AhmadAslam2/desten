import { NavigatorScreenParams } from '@react-navigation/native';
import { Product } from './shopify';

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
  Category: undefined;
  Shop: { collectionHandle?: string; collectionTitle?: string };
  'Buy again': undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  ProductDetail: { product: Product };
  Products: { collectionHandle?: string; collectionTitle?: string };
  AccountDetails: undefined;
  FaqModal: undefined;
};

export type AuthStackParamList = {
  Profile: undefined;
  Products: undefined;
};
