import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Theme = {
  background: string;
  inverseBackground: string;
  inverseBackgroundHighlight:string;
  normalText: string;
  inverseText: string;
  highlightedText: string;
  textBackgroundBlack: string;
  themeColor: string;
  themeColorHighlitch: string;
  themeBackground: string;
  inputBackground: string;
  redColor:string;
  darkMode:boolean;
};

const lightTheme: Theme = {
  background: '#ffffff',
  inverseBackground: '#284f63',
  inverseBackgroundHighlight: '#469bc6',
  normalText: '#1f1f1f',
  inverseText: '#efefef',
  highlightedText: '#ffffff',
  textBackgroundBlack: '#1f1f1f',
  themeColor: '#0e6cb9',
  themeColorHighlitch: "#16aee0",
  themeBackground: 'white',
  inputBackground: '#ffffff',
  redColor:"#f05648",
  darkMode:false,

};

const darkTheme: Theme = {
  background: '#284f63',
  inverseBackground: '#ffffff',
  inverseBackgroundHighlight: '#ffffff',
  normalText: '#ffffff',
  inverseText: '#222222',
  highlightedText: '#ffffff',
  textBackgroundBlack: '#ffffff',
  themeColor: '#0e6cb9',
  themeColorHighlitch: "#16aee0",
  themeBackground: '#1f1f1f',
  inputBackground: '#ffffff',
  redColor:"#f05648",
  darkMode:true
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


