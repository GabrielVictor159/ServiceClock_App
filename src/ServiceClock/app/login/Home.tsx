
import React from 'react';
import { Text,Image, Button, Pressable, TouchableOpacity } from 'react-native';
import DefaultLayout from '../../components/DefaultLayout';
import { useTheme } from '../../provider/ThemeProvider';
import { createHomeStyle } from '../../styles/App/Login/HomeStyle';
import { useTranslation } from 'react-i18next';
interface HomeProps {
  navigation: any; 
}
const Home: React.FC<HomeProps> = ({ navigation}) => {
  const { theme, toggleTheme } = useTheme(); 
  const styles = createHomeStyle(theme);
  const { t, i18n } = useTranslation();
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
          <Text style={styles.ButtonText}>{t('home.button1')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        style={styles.Button}
        onPress={() => navigation.navigate('RegisterCompany')}
        >
          <Text style={styles.ButtonText}>{t('home.button2')}</Text>
        </TouchableOpacity>
        <Text style={styles.describeText}>{t('home.subText')}</Text>
      </DefaultLayout>
      </>
  );
};

export default Home;
