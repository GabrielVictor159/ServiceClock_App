import React from 'react';
import Pages from './app/Pages';
import { PageProvider } from './provider/PageProvider';
import { ThemeProvider } from './provider/ThemeProvider';
import Toast from 'react-native-toast-message';
import { AuthenticationProvider } from './provider/AuthenticationProvider';
import { I18nextProvider } from 'react-i18next';
import i18n from './resources/i18n';

const App = () => {
  return (
    <>
    <I18nextProvider i18n={i18n}>
      <PageProvider>
        <ThemeProvider>
          <AuthenticationProvider>
            <Pages />
          </AuthenticationProvider>
        </ThemeProvider>
      </PageProvider>
      <Toast />
    </I18nextProvider>
    </>
  );
};

export default App;
