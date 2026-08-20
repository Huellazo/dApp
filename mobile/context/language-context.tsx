import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import es from '../i18n/es.json';
import en from '../i18n/en.json';

export type SupportedLanguage = 'es' | 'en';

type TranslationsMap = typeof es;

const translations: Record<SupportedLanguage, TranslationsMap> = {
  es,
  en,
};

const STORAGE_KEY = '@huellazo_language';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'es',
  setLanguage: () => {},
  t: (key: string) => key,
});

function detectDeviceLanguage(): SupportedLanguage {
  try {
    let locale = 'es';
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      locale = Intl.DateTimeFormat().resolvedOptions().locale || 'es';
    } else if (typeof navigator !== 'undefined' && navigator.language) {
      locale = navigator.language;
    }
    return locale.toLowerCase().startsWith('en') ? 'en' : 'es';
  } catch {
    return 'es';
  }
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<SupportedLanguage>('es');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'es' || saved === 'en') {
        setLanguageState(saved);
      } else {
        const detected = detectDeviceLanguage();
        setLanguageState(detected);
      }
    }).catch(() => {
      setLanguageState(detectDeviceLanguage());
    });
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang).catch(console.error);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to Spanish if key missing in current language
        let fallbackValue: any = translations['es'];
        for (const fk of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
            fallbackValue = fallbackValue[fk];
          } else {
            return key;
          }
        }
        value = fallbackValue;
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        value = value.replace(new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'), String(paramVal));
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
