"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "ev-demo-platform-revealed";

type PlatformLayerContextValue = {
  revealed: boolean;
  reveal: () => void;
  toggle: () => void;
};

const PlatformLayerContext = createContext<PlatformLayerContextValue | null>(null);

export function PlatformLayerProvider({ children }: { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") setRevealed(true);
  }, []);

  const reveal = () => {
    setRevealed(true);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  const toggle = () => {
    setRevealed((prev) => {
      const next = !prev;
      sessionStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  };

  return (
    <PlatformLayerContext.Provider value={{ revealed, reveal, toggle }}>
      {children}
    </PlatformLayerContext.Provider>
  );
}

export function usePlatformLayer() {
  const ctx = useContext(PlatformLayerContext);
  if (!ctx) throw new Error("usePlatformLayer must be used within PlatformLayerProvider");
  return ctx;
}
