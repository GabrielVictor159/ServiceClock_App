import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './login/Login';
import Home from './Home/Home';
import { usePage } from '../provider/PageProvider';
import { navigationTheme } from '../styles/Navigation/NavigationStyles';

const Stack = createNativeStackNavigator();

const Pages = () => {
  const { page } = usePage();

  const mapPages = () => {
    switch (page) {
      case 0:
        return (
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen 
              name="Home" 
              component={Home} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Login" 
              component={Login} 
              options={{ headerShown: false }} 
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
    <NavigationContainer theme={navigationTheme}>
      {mapPages()}
    </NavigationContainer>
  );
};

export default Pages;
