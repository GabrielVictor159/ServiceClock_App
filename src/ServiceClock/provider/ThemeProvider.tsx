import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Theme = {
  background: string;
  normalText: string;
  highlightedText: string;
  textBackgroundBlack: string;
  themeColor: string;
  themeBackground: string;
};

const lightTheme: Theme = {
  background: '#ffffff',
  normalText: '#1f1f1f',
  highlightedText: '#ffffff',
  textBackgroundBlack: '#1f1f1f',
  themeColor: '#f5a623',
  themeBackground: 'white',
};

const darkTheme: Theme = {
  background: '#284f63',
  normalText: '#ffffff',
  highlightedText: '#ffffff',
  textBackgroundBlack: '#ffffff',
  themeColor: '#f5a623',
  themeBackground: '#1f1f1f',
};

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};


