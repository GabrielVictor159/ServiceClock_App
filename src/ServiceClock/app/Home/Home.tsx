
import React from 'react';
import { Text,Image, Button, Pressable, TouchableOpacity } from 'react-native';
import DefaultLayout from '../../components/DefaultLayout';
import { useTheme } from '../../provider/ThemeProvider';
import { createHomeStyle } from '../../styles/App/Home/HomeStyle';
interface HomeProps {
  navigation: any; 
}
const Home: React.FC<HomeProps> = ({ navigation}) => {
  const { theme, toggleTheme } = useTheme(); 
  const styles = createHomeStyle(theme);
  return (
      <>
      <DefaultLayout
      containerStyle={{gap:30}}
      >
        <Text style={styles.Title}>Service Clock</Text>
        <Image
          source={require('../../assets/_abb13b96-db8f-4cc9-aac1-26cc5209f118.png')}
          style={{ width: 300, height: 300 }}
        />
        <Text>{"\n\n"}</Text>
        <TouchableOpacity  
        style={styles.Button}
        onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.ButtonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        style={styles.Button}
        onPress={() => navigation.navigate('RegisterCompany')}
        >
          <Text style={styles.ButtonText}>Registrar Empresa</Text>
        </TouchableOpacity>
        <Text style={styles.describeText}>Serviço de agendamento de serviços para usuários</Text>
      </DefaultLayout>
      </>
  );
};

export default Home;
