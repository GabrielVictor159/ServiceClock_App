import React from 'react';
import Pages from './app/Pages';
import { PageProvider } from './provider/PageProvider';
import { ThemeProvider } from './provider/ThemeProvider';
import Toast from 'react-native-toast-message';
import { AuthenticationProvider } from './provider/AuthenticationProvider';

const App = () => {
  return (
    <>
      <PageProvider>
        <ThemeProvider>
          <AuthenticationProvider>
            <Pages />
          </AuthenticationProvider>
        </ThemeProvider>
      </PageProvider>
      <Toast />
    </>
  );
};

export default App;
