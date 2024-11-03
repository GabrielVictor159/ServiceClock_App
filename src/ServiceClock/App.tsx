import React from 'react';
import { View, StyleSheet } from 'react-native';
import Pages from './app/Pages';
import { PageProvider } from './provider/PageProvider';
import { ThemeProvider } from './provider/ThemeProvider';
import Toast, { ToastConfig } from 'react-native-toast-message';
import { AuthenticationProvider } from './provider/AuthenticationProvider';
import { I18nextProvider } from 'react-i18next';
import i18n from './resources/i18n';
import { KeyboardProvider } from './provider/KeyboardProvider';
import { LoadingProvider } from './provider/IsLoadingProvider';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <LoadingProvider>
        <PageProvider>
          <ThemeProvider>
            <AuthenticationProvider>
              <KeyboardProvider>
                <Pages />
                <Toast />
                <LoadingScreen />
              </KeyboardProvider>
            </AuthenticationProvider>
          </ThemeProvider>
        </PageProvider>
      </LoadingProvider>
    </I18nextProvider>
  );
};

export default App;
