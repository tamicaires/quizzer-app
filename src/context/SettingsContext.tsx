import React, { createContext, useContext, useState, useEffect } from "react";
import { loadFromStorage, saveToStorage } from "@/services/storage.service";

interface SettingsContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(() =>
    loadFromStorage("sound_enabled", true)
  );

  useEffect(() => {
    saveToStorage("sound_enabled", soundEnabled);
  }, [soundEnabled]);

  const toggleSound = () => setSoundEnabled((prev) => !prev);

  return (
    <SettingsContext.Provider value={{ soundEnabled, toggleSound }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};
