import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EspecialButtonsContextType {
  isEspecialButtonsVisible: boolean;
  setIsEspecialButtonsVisible: (visible: boolean) => void;
}

const EspecialButtonsContext = createContext<EspecialButtonsContextType | undefined>(undefined);

const EspecialButtonsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEspecialButtonsVisible, setIsEspecialButtonsVisible] = useState(true);

  return (
    <EspecialButtonsContext.Provider value={{ isEspecialButtonsVisible, setIsEspecialButtonsVisible }}>
      {children}
    </EspecialButtonsContext.Provider>
  );
};

const useEspecialButtons = () => {
  const context = useContext(EspecialButtonsContext);
  if (!context) {
    throw new Error('useEspecialButtons must be used within an EspecialButtonsProvider');
  }
  return context;
};

export { EspecialButtonsProvider, useEspecialButtons };
