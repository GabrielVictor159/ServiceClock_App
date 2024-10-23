import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Image, TouchableOpacity, Animated, Button } from 'react-native';
import { createDefaultLayoutStyle } from '../styles/Components/DefaultLayoutStyle';
import { useTheme } from '../provider/ThemeProvider';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import SelectDropdownModal from './SelectDropdownModal';

interface DefaultLayoutProps {
  children: React.ReactNode;
  containerStyle?: object;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children, containerStyle }) => {
  const { theme, toggleTheme } = useTheme();
  const styles = createDefaultLayoutStyle(theme);
  return (
    <View style={[styles.body, containerStyle]}>
      {children}
    </View>
  );
};

export default DefaultLayout;
