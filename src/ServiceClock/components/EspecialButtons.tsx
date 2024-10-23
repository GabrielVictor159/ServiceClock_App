import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity,Image } from 'react-native';
import { useTheme } from '../provider/ThemeProvider';
import { createDefaultLayoutStyle } from '../styles/Components/DefaultLayoutStyle';
import { useTranslation } from 'react-i18next';
import SelectDropdownModal from './SelectDropdownModal';

const EspecialButtons: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const styles = createDefaultLayoutStyle(theme);
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = React.useState(i18n.language);
  const [modalLanguageVisible, setModalLanguageVisible] = useState(false);

  const [languages, setLanguages] = useState<string[]>([]);

  useEffect(() => {
    if (Array.isArray(i18n.options.supportedLngs))
      setLanguages(i18n.options.supportedLngs.filter((lang: string) => lang !== 'cimode'));
  }, []);

  const handleLanguageSelect = (item: any) => {
    setModalLanguageVisible(item);
    setSelectedLanguage(item);
    i18n.changeLanguage(item);
  };

  const animation = useRef(new Animated.Value(0)).current;

  const [isViewOptionVisible, setIsViewOptionVisible] = useState(false);

  const toggleAnimation = () => {
    if (isViewOptionVisible) {
      Animated.timing(animation, {
        toValue: 0, 
        duration: 400,
        useNativeDriver: false,
      }).start(() => setIsViewOptionVisible(false)); 
    } else {
      setIsViewOptionVisible(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start(); 
    }
  };

  useEffect(() => {
  }, []);
  const rightAnimatedStyle = {
    right: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [-110, 20],
    }),
  };
    return (
        <>
        <Animated.View style={[styles.boxOptions, rightAnimatedStyle]}>
          <TouchableOpacity onPress={toggleAnimation}>
            <View style={styles.ButtonOptionsMenu}>
              <Text style={styles.ButtonOptionsMenuText}>{'<'}</Text>
            </View> 
          </TouchableOpacity> 
          <TouchableOpacity onPress={toggleTheme} accessibilityLabel={t('toggleTheme')}>
            <Image
              source={require('../assets/night-mode.png')}
              style={{ width: 40, height: 40 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalLanguageVisible(true)}>
            <View style={{ width: 35, height: 35, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 40, backgroundColor: theme.highlightedText }}>
              <Text style={{ color: 'black' }}>
                {selectedLanguage}
              </Text>
            </View>
          </TouchableOpacity>
      </Animated.View>
      <SelectDropdownModal
      visible={modalLanguageVisible}
      options={languages}
      onSelect={handleLanguageSelect}
      onClose={() => setModalLanguageVisible(false)}
    />
    </>
    );
};


export default EspecialButtons;