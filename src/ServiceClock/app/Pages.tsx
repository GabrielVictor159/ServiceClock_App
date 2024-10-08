import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Importação do Tab Navigator
import Login from './login/Login';
import Home from './login/Home';
import { usePage } from '../provider/PageProvider';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { createNavigationTheme } from '../styles/Navigation/NavigationStyles';
import { useTheme } from '../provider/ThemeProvider';
import IndexClient from './Client/IndexClient';
import IndexCompany from './Company/IndexCompany';
import { AuthenticationItem, useAuthentication } from '../provider/AuthenticationProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RegisterCompany from './login/RegisterCompany';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Pages = () => {
  const { page, setPage } = usePage();
  const { theme } = useTheme();
  const { authenticationItem, setAuthenticationItem } = useAuthentication();
  const styles = createNavigationTheme(theme);

  useEffect(() => {
    //AsyncStorage.clear();
    const loadAuthenticationItem = async () => {
      const storedItem = await AsyncStorage.getItem('authenticationItem');
      if (storedItem) {
        const parsedItem = JSON.parse(storedItem);
        setAuthenticationItem(new AuthenticationItem(parsedItem.Email, parsedItem.Token, parsedItem.Type));
        if (parsedItem.Type === "Client") {
          setPage(1);
        }
        else if (parsedItem.Type === "Company") {
          setPage(2);
        }
      }
    };
    loadAuthenticationItem();
  }, []);

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
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="RegisterCompany" component={RegisterCompany} />
          </Stack.Navigator>
        );
      case 1:
        return (
          <Tab.Navigator
          initialRouteName="Home"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Tab.Screen name="Home" component={IndexClient} />
          </Tab.Navigator>
        );
      case 2:
        return (
          <Tab.Navigator
          initialRouteName="Home"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Tab.Screen name="Home" component={IndexCompany} />
          </Tab.Navigator>
        );
      default:
        return null;
    }
  };

  return (
    <NavigationContainer theme={styles}>
      {mapPages()}
    </NavigationContainer>
  );
};

export default Pages;
