import {
  GamingIcon,
  PaymentIcon,
  PlayIcon,
  ShoppingIcon,
  SimIcon,
  GamingWhite,
  PaymentWhite,
  PlayWhite,
  ShoppingWhite,
  SimWhite,
} from '../assets/icons';

export const HOME_CATEGORIES = [
  { key: 'payments', label: 'Payments', Icon: PaymentIcon, collectionHandle: 'zahlungsmittel' },
  { key: 'gaming', label: 'Gaming', Icon: GamingIcon, collectionHandle: 'unterhaltung' },
  {
    key: 'shopping',
    label: 'Shopping',
    Icon: ShoppingIcon,
    collectionHandle: 'einkaufsgutschein-online-kaufen',
  },
  {
    key: 'phone',
    label: 'Phone',
    Icon: SimIcon,
    collectionHandle: 'handyguthaben-online-aufladen',
  },
  {
    key: 'entertainment',
    label: 'Entertainment',
    Icon: PlayIcon,
    collectionHandle: 'unterhaltung',
  },
];

export const TOP_CATEGORIES = [
  { key: 'payments', label: 'Payments', Icon: PaymentWhite, collectionHandle: 'zahlungsmittel' },
  { key: 'gaming', label: 'Gaming', Icon: GamingWhite, collectionHandle: 'unterhaltung' },
  {
    key: 'shopping',
    label: 'Shopping',
    Icon: ShoppingWhite,
    collectionHandle: 'einkaufsgutschein-online-kaufen',
  },
  {
    key: 'phone',
    label: 'Phone',
    Icon: SimWhite,
    collectionHandle: 'handyguthaben-online-aufladen',
  },
  {
    key: 'entertainment',
    label: 'Entertainment',
    Icon: PlayWhite,
    collectionHandle: 'unterhaltung',
  },
];
