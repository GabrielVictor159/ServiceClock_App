import React from 'react';
import Pages from './app/Pages';
import { PageProvider } from './provider/PageProvider';

const App = () => {
  return (
    <>
      <PageProvider>
        <Pages />
      </PageProvider>
    </>
  );
};

export default App;
