import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { en } from '../translations/en';
import { de } from '../translations/de';
import { fr } from '../translations/fr';
import { pl } from '../translations/pl';

const translationStorage = new MMKV({
  id: 'translation-storage',
  encryptionKey: 'your-translation-encryption-key',
});

type Translations = typeof en;

interface TranslationState {
  translations: {
    en: Translations;
    de: Translations;
    fr: Translations;
    pl: Translations;
  };
  currentLanguage: string;
  t: (key: string) => string;
  setLanguage: (language: string) => void;
}

const getNestedTranslation = (obj: any, path: string): string => {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result[key] === undefined) {
      return path;
    }
    result = result[key];
  }

  return result;
};

export const useTranslation = create<TranslationState>()(
  persist(
    (set, get) => ({
      translations: {
        en: en as Translations,
        de: de as Translations,
        fr: fr as Translations,
        pl: pl as Translations,
      },
      currentLanguage: 'en',

      t: (key: string) => {
        const state = get();
        const translation =
          state.translations[state.currentLanguage as keyof typeof state.translations];
        return getNestedTranslation(translation, key);
      },

      setLanguage: (language: string) => {
        set({ currentLanguage: language });
      },
    }),
    {
      name: 'translation-storage',
      storage: {
        getItem: name => {
          const value = translationStorage.getString(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          translationStorage.set(name, JSON.stringify(value));
        },
        removeItem: name => {
          translationStorage.delete(name);
        },
      },
    }
  )
);
