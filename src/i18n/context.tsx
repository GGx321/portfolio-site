"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import {
  type Locale,
  type Translations,
  getTranslations,
} from "./index";

interface I18nContextType {
  locale: Locale;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | null>(null);

interface I18nProviderProps {
  children: ReactNode;
  locale: Locale;
}

export function I18nProvider({ children, locale }: I18nProviderProps) {
  const t = getTranslations(locale);

  return (
    <I18nContext.Provider value={{ locale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  
  return context;
}
