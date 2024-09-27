import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PageContextType {
  page: number;
  setPage: (newPage: number) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

const PageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [page, setPageState] = useState(0);

  const setPage = (newPage: number) => setPageState(newPage);

  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>
  );
};

const usePage = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePage must be used within a PageProvider');
  }
  return context;
};

export { PageProvider, usePage };
