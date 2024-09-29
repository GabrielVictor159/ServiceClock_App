
import React from 'react';
import { Text } from 'react-native';
import DefaultLayout from '../../components/DefaultLayout';
import { useTheme } from '../../provider/ThemeProvider';
const Login = () => {
  const { theme, toggleTheme } = useTheme(); 
  return (
      <>
      <DefaultLayout
      containerStyle={{gap:30, backgroundColor: theme.themeBackground}}
      >
        <Text>Login</Text>

      </DefaultLayout>
      </>
  );
};

export default Login;
