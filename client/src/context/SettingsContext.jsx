import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const SettingsContext = createContext({
  settings: {
    siteName: 'Shazzed Shuvo',
    logoName: 'SS',
    tagline: 'Web Specialist & Web Developer',
    logo: '',
    favicon: '',
    teamName: 'Dont Worry',
    email: 'shazzedshuvo@gmail.com',
    availableForHire: true,
  },
  loading: true,
  refreshSettings: () => {},
  updateSettingsState: () => {},
});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: 'Shazzed Shuvo',
    logoName: 'SS',
    tagline: 'Web Specialist & Web Developer',
    logo: '',
    favicon: '',
    teamName: 'Dont Worry',
    email: 'shazzedshuvo@gmail.com',
    availableForHire: true,
  });
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      const { data } = await api.get('/settings');
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // Dynamically update document title and favicon
  useEffect(() => {
    // 1. Dynamic Title
    if (settings.siteTitle) {
      document.title = settings.siteTitle;
    } else if (settings.siteName) {
      document.title = `${settings.siteName} — ${settings.tagline || 'Web Specialist & Web Developer'}`;
    }

    // 2. Dynamic Favicon
    if (settings.favicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.favicon;
    }
  }, [settings.siteTitle, settings.siteName, settings.tagline, settings.favicon]);

  const updateSettingsState = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings,
        updateSettingsState,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
