
import React, { useState } from 'react';
import { Text, TextInput } from 'react-native';
import DefaultLayout from '../../components/DefaultLayout';
import { useTheme } from '../../provider/ThemeProvider';
import { createLoginStyle } from '../../styles/App/Login/LoginStyle';
const Login = () => {
  const { theme, toggleTheme } = useTheme(); 
  const styles = createLoginStyle(theme);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
      <>
      <DefaultLayout
      containerStyle={{gap:30, backgroundColor: theme.themeBackground}}
      >
        <TextInput
        style={styles.Input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Digite seu email"
        />
        <TextInput
        style={styles.Input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        placeholder="Digite sua senha"
        />
        
      </DefaultLayout>
      </>
  );
};

export default Login;
