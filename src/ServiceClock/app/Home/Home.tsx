
import React from 'react';
import { Text,Image, Button } from 'react-native';
import DefaultLayout from '../../components/DefaultLayout';
const Home = () => {
  return (
      <>
      <DefaultLayout
      containerStyle={{gap:30}}
      >
        <Text>Service Clock</Text>
        <Image
          source={require('../../assets/_abb13b96-db8f-4cc9-aac1-26cc5209f118.png')}
            style={{ width: 300, height: 300 }}
        />
        <Button
          title="Entrar"
          onPress={() => console.log('Login')}
        />
        <Button
          title="Registrar sua empresa"
          onPress={() => console.log('Login')}
        />
        <Text>Serviço de agendamento de serviços para usuários</Text>
      </DefaultLayout>
      </>
  );
};

export default Home;
