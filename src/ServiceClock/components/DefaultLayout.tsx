
import React from 'react';
import { Text, View,Image, Touchable, TouchableOpacity } from 'react-native';
import { createDefaultLayoutStyle } from '../styles/Components/DefaultLayoutStyle';
import { useTheme } from '../provider/ThemeProvider';
interface DefaultLayoutProps{
    children: React.ReactNode;
    containerStyle?: object;
}
const DefaultLayout: React.FC<DefaultLayoutProps> = ({children, containerStyle}) => {
  const { theme, toggleTheme } = useTheme(); 
  const styles = createDefaultLayoutStyle(theme);
  return (
      <>
    <View style={[styles.body, containerStyle]}>
      <TouchableOpacity onPress={toggleTheme}
      style={{position: 'absolute', top: 50, right: 20}}
      >
      <Image
        source={require('../assets/night-mode.png')}
        style={{ width: 40, height: 40 }}
      />
      </TouchableOpacity>
      {children}
    </View>
      </>
  );
};

export default DefaultLayout;
