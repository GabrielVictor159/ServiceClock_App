import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './login/Login';
import Home from './Home/Home';
import { usePage } from '../provider/PageProvider';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { createNavigationTheme } from '../styles/Navigation/NavigationStyles';
import { useTheme } from '../provider/ThemeProvider';

const Stack = createNativeStackNavigator();

const Pages = () => {
  const { page } = usePage();
  const { theme, toggleTheme } = useTheme(); 
  const styles = createNavigationTheme(theme);
  const mapPages = () => {
    switch (page) {
      case 0:
        return (
          <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
          >
            <Stack.Screen 
              name="Home" 
              component={Home} 
            />
            <Stack.Screen 
              name="Login" 
              component={Login} 
            />
          </Stack.Navigator>
        );
      case 1:
        return (
          <>
          
          </>
        );
    }
  }

  return (
    <NavigationContainer theme={styles}>
      {mapPages()}
    </NavigationContainer>
  );
};

export default Pages;
