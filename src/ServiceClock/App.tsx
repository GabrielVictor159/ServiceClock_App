import React from 'react';
import Pages from './app/Pages';
import { PageProvider } from './provider/PageProvider';
import { ThemeProvider } from './provider/ThemeProvider';

const App = () => {
  return (
    <>
      <PageProvider>
        <ThemeProvider>
          <Pages />
        </ThemeProvider>
      </PageProvider>
    </>
  );
};

export default App;
