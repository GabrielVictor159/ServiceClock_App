
import React, { useState } from 'react';
import { Text, TextInput, Image, TouchableOpacity, View } from 'react-native';
import DefaultLayout from '../../components/DefaultLayout';
import { useTheme } from '../../provider/ThemeProvider';
import { createLoginStyle } from '../../styles/App/Login/LoginStyle';
import { usePage } from '../../provider/PageProvider';
import { ServiceFactory, ServiceType } from '../../services/ServiceFactory';
import { AuthenticationItem, useAuthentication } from '../../provider/AuthenticationProvider';
interface LoginProps {
  navigation: any;
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const { page, setPage } = usePage();
  const {authenticationItem, setAuthenticationItem} = useAuthentication();

  const styles = createLoginStyle(theme);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authenticationService = ServiceFactory.createService(ServiceType.Authentication);

  const login = async () => {
    const response = await authenticationService.Login(email, password);
    if(response[1]!==""){
      setAuthenticationItem(new AuthenticationItem(email, response[0],response[1]));
    }
    if (response[1]==="Client") {
      setPage(1);
    }
    if (response[1]==="Company") {
      setPage(2);
    }
  }

  return (
    <>
      <DefaultLayout
        containerStyle={{ gap: 10}}
      >
        <Image
          source={require('../../assets/profile.png')}
          style={{ width: 250, height: 250 }}
        />
        <Text>{"\n\n"}</Text>
        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.Input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Digite seu email"
          />
        </View>
        <View>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.Input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="Digite sua senha"
          />
        </View>
        <Text>{"\n"}</Text>
        <TouchableOpacity
          style={styles.Button}
          onPress={() => { login();}}
        >
          <Text style={styles.ButtonText}>Entrar</Text>
        </TouchableOpacity>
      </DefaultLayout>
    </>
  );
};

export default Login;
