// SettingsContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

export interface Settings {
  theme: 'calm' | 'bright' | 'classic';
  soundEnabled: boolean;
  language: string;
  showRowSums: boolean;
  dotDivider: boolean;
  mode: 'common' | 'ascent';
  showHelp: boolean;
  moveByClick: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  theme: 'classic',
  soundEnabled: false,
  language: 'ru',
  showRowSums: true,
  dotDivider: false,
  mode: 'common',
  showHelp: true,
  moveByClick: false
};

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Загрузка настроек при монтировании
  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem('abacus-settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings({ ...defaultSettings, ...parsed });
        }
      } catch (error) {
        console.error('Ошибка загрузки настроек:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSettings();
  }, []);

  // Сохранение настроек при изменении
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('abacus-settings', JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };
  
  if (!isLoaded) {
    return <div>Загрузка настроек...</div>;
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};