// CustomTabBar.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import geral from '../styles/Common/Geral';
import { Theme, useTheme } from '../provider/ThemeProvider';
import { useKeyboard } from '../provider/KeyboardProvider';

const CustomTabBar: React.FC<MaterialTopTabBarProps> = (props) => {
  const { isKeyboardHidden } = useKeyboard();
  const { state, descriptors, navigation } = props;
  const { theme } = useTheme();
  const styles = createStyles(theme,isKeyboardHidden);

  return (
        <View style={styles.container}>
      {state.routes.map((route: { key: string; name: string }, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{...styles.item, opacity: isFocused ? 1 : 0.5}}
          >
            {options.tabBarIcon && options.tabBarIcon({ focused: isFocused, color: theme.inverseText })}
            <Text style={{ color: theme.inverseText, fontWeight: 'bold', fontFamily: 'Roboto' }}>
              {options.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const createStyles = (theme:Theme, isKeyboardHidden: boolean = true)=> StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.inverseBackgroundHighlight,
    elevation: 5, 
    zIndex: 1,
    position:'absolute',
    height:isKeyboardHidden? '7%':"15%",
    width:'100%',
    top:isKeyboardHidden?'93%':"85%" ,
    display: isKeyboardHidden?'flex':'none',
    alignItems: 'center',
  },
  item:{
    textAlign:'center',
    display: 'flex',
    alignItems: 'center',
  }
});

export default CustomTabBar;
