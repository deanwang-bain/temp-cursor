"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations } from "./translations";

export type Locale = "en" | "zh";
export type TranslationKey = (typeof translations)[Locale];

type I18nContextValue = {
  locale: Locale;
  t: TranslationKey;
  toggleLocale: () => void;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("ev-demo-locale") as Locale | null;
    if (saved === "en" || saved === "zh") setLocaleState(saved);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("ev-demo-locale", l);
  };

  const toggleLocale = () => setLocale(locale === "en" ? "zh" : "en");

  return (
    <I18nContext.Provider value={{ locale, t: translations[locale], toggleLocale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function pick<T extends { [k: string]: string }>(obj: T, enKey: keyof T, locale: Locale, zhKey?: keyof T): string {
  if (locale === "zh" && zhKey && obj[zhKey]) return String(obj[zhKey]);
  if (locale === "zh" && String(enKey).endsWith("Zh")) return String(obj[enKey]);
  const zhAlt = String(enKey) + "Zh";
  if (locale === "zh" && obj[zhAlt as keyof T]) return String(obj[zhAlt as keyof T]);
  return String(obj[enKey]);
}
