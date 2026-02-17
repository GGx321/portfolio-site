import { en } from "./locales/en";
import { ru } from "./locales/ru";

export type Locale = "en" | "ru";
export type Translations = typeof en;

export const locales = ["en", "ru"] as const;
export const localeNames: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
};

export const translations: Record<Locale, Translations> = {
  en,
  ru,
};

export const defaultLocale: Locale = "en";

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations[defaultLocale];
}
