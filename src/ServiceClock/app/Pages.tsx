
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, Image } from 'react-native';
import Login from './login/Login';
import Home from './login/Home';
import { usePage } from '../provider/PageProvider';
import { createNavigationTheme } from '../styles/Navigation/NavigationStyles';
import { useTheme } from '../provider/ThemeProvider';
import AppointmentsClient from './Client/AppointmentsClient';
import AppointmentsCompany from './Company/AppointmentsCompany';
import { AuthenticationItem, useAuthentication } from '../provider/AuthenticationProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RegisterCompany from './login/RegisterCompany';
import { ServiceFactory, ServiceType } from '../services/ServiceFactory';
import { AuthenticationService } from '../services/AuthenticationService';
import Services from './Company/Services';
import CustomTabBar from '../components/CustomTabBar';
import EspecialButtons from '../components/EspecialButtons';
import { useTranslation } from 'react-i18next';
import MensagensCompany from './Company/MensagensCompany';
import UserCompany from './Company/UserCompany';
import MensagensClient from './Client/MensagensClient';
import UserClient from './Client/UserClient';
import UsersCompanyView from './Company/UsersCompanyView';
import { useKeyboard } from '../provider/KeyboardProvider';
import LoadingScreen from '../components/LoadingScreen';
import { useEspecialButtons } from '../provider/EspecialButtonsProvider';

const Stack = createNativeStackNavigator();
const MaterialTab = createMaterialTopTabNavigator();

const Pages: React.FC = () => {
  const { isKeyboardHidden } = useKeyboard();
  const { page, setPage } = usePage();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const { isEspecialButtonsVisible, setIsEspecialButtonsVisible } = useEspecialButtons();
  const { setAuthenticationItem } = useAuthentication();
  const styles = createNavigationTheme(theme);

  const authenticationService = ServiceFactory.createService(ServiceType.Authentication) as AuthenticationService;

  useEffect(() => {
    const loadAuthenticationItem = async () => {
      const storedItem = await AsyncStorage.getItem('authenticationItem');
      if (storedItem) {
        const parsedItem = JSON.parse(storedItem);
        const isAuthenticated = await authenticationService.IsAuthenticated(parsedItem.Token);
        if (!isAuthenticated) {
          AsyncStorage.removeItem('authenticationItem');
          return;
        }
        setAuthenticationItem(new AuthenticationItem(parsedItem.UserId, parsedItem.Email, parsedItem.Token, parsedItem.Type));
        if (parsedItem.Type === "Client") {
          setPage(1);
        } else if (parsedItem.Type === "Company") {
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
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="RegisterCompany" component={RegisterCompany} />
          </Stack.Navigator>
        );
      case 1:
        return (
          <View style={{ flex: 1 }}>
            <MaterialTab.Navigator
              initialRouteName="Home"
              tabBar={(props) => <CustomTabBar {...props} />}
              screenOptions={{
                tabBarIndicatorStyle: { backgroundColor: 'blue' },
                tabBarLabelStyle: { fontSize: 16 },
              }}
            >
              <MaterialTab.Screen
                name='Appointment'
                component={AppointmentsClient}
                options={{
                  title: t('Appointment'),
                  tabBarIcon: ({ color, focused }) => (
                    <Image source={require("../assets/appointment.png")}
                      style={{ width: 25, height: 25, tintColor: theme.inverseText }} />
                  )
                }}
              />
              <MaterialTab.Screen
                name="Messages"
                component={MensagensClient}
                options={{
                  title: t('Messages'),
                  tabBarIcon: ({ color, focused }) => (
                    <Image source={require("../assets/chat.png")}
                      style={{ width: 25, height: 25, tintColor: theme.inverseText }} />
                  )
                }}
              />
              <MaterialTab.Screen
                name="User"
                component={UserClient}
                options={{
                  title: t('User'),
                  tabBarIcon: ({ color, focused }) => (
                    <Image source={require("../assets/user_black.png")}
                      style={{ width: 25, height: 25, tintColor: theme.inverseText }} />
                  )
                }}
              />
            </MaterialTab.Navigator>
          </View>
        );
      case 2:
        return (
          <View style={{ flex: 1 }}>
            <MaterialTab.Navigator
              initialRouteName="Home"
              tabBar={(props) => <CustomTabBar {...props} />}
              screenOptions={{
                tabBarIndicatorStyle: { backgroundColor: 'blue' },
                tabBarLabelStyle: { fontSize: 16 },
              }}
            >
              <MaterialTab.Screen
                name='Appointment'
                component={AppointmentsCompany}
                options={{
                  title: t('Appointment'),
                  tabBarIcon: ({ color, focused }) => (
                    <Image source={require("../assets/appointment.png")}
                      style={{ width: 25, height: 25, tintColor: theme.inverseText }} />
                  )
                }}
              />
              <MaterialTab.Screen
                name="Services"
                component={Services}
                options={{
                  title: t('Services'),
                  tabBarIcon: ({ color, focused }) => (
                    <Image source={require("../assets/technical-service.png")}
                      style={{ width: 25, height: 25, tintColor: theme.inverseText }} />
                  )
                }}
              />
              <MaterialTab.Screen
                name="Messages"
                component={MensagensCompany}
                options={{
                  title: t('Messages'),
                  tabBarIcon: ({ color, focused }) => (
                    <Image source={require("../assets/chat.png")}
                      style={{ width: 25, height: 25, tintColor: theme.inverseText }} />
                  )
                }}
              />
              <MaterialTab.Screen
                name="User"
                component={UserCompany}
                options={{
                  title: t('User'),
                  tabBarIcon: ({ color, focused }) => (
                    <Image source={require("../assets/user_black.png")}
                      style={{ width: 25, height: 25, tintColor: theme.inverseText }} />
                  )
                }}
              />
              <MaterialTab.Screen
                name="Clients"
                component={UsersCompanyView}
                options={{
                  title: t('Clients'),
                  tabBarIcon: ({ color, focused }) => (
                    <Image source={require("../assets/public-relation.png")}
                      style={{ width: 25, height: 25, tintColor: theme.inverseText }} />
                  )
                }}
              />
            </MaterialTab.Navigator>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <NavigationContainer theme={styles}>
        {mapPages()}
      </NavigationContainer>
      {isEspecialButtonsVisible &&
        <EspecialButtons />
      }
    </>
  );
};

export default Pages;
