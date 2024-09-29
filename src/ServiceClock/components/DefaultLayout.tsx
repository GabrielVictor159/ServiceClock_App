
import React from 'react';
import { Text, View } from 'react-native';
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
      {children}
    </View>
      </>
  );
};

export default DefaultLayout;
