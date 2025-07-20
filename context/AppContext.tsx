import { appConfig } from "@/config/appConfig";
import { storage } from "@/lib/storage/mmkv";
import { AppDataSchema, type AppData } from "@/zod/schemas/AppDataSchema";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AppContextValue {
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
  exportData: () => string;
  importData: (json: string) => void;
}

const defaultState = AppDataSchema.parse(undefined);
const AppContext = createContext<AppContextValue | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export default function AppContextProvider({ children }: Props) {
  const [appData, setAppData] = useState<AppData>(() => {
    const raw = storage.getString(appConfig.storageKey);
    if (raw) {
      try {
        return AppDataSchema.parse(JSON.parse(raw));
      } catch {
        storage.delete(appConfig.storageKey);
      }
    }
    return defaultState;
  });

  const exportData = () => {
    return JSON.stringify(appData, null, 2);
  };

  const importData = (json: string) => {
    try {
      const parsed = AppDataSchema.parse(JSON.parse(json));
      setAppData(parsed);
    } catch (err) {
      console.error("Invalid import data:", err);
      throw err;
    }
  };

  useEffect(() => {
    storage.set(appConfig.storageKey, JSON.stringify(appData));
  }, [appData]);

  return (
    <AppContext.Provider
      value={{ appData, setAppData, exportData, importData }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}
