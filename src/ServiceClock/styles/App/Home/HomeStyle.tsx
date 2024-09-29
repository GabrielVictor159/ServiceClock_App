import { StyleSheet } from "react-native";
import geral from "../../Common/Geral";
import { Theme } from '../../../provider/ThemeProvider';

export const createHomeStyle = (theme: Theme) =>
  StyleSheet.create({
    Title: {
      fontSize: 40,
      fontWeight: 'bold',
      color: theme.textBackgroundBlack,
      textAlign: 'center',
    },
    Button: {
      backgroundColor: theme.themeColor,
      color: theme.highlightedText,
      padding: 10,
      borderRadius: 5,
      width: 200,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...geral.shadow,
    },
    ButtonText: {
      color: theme.highlightedText,
      fontSize: 18,
    },
    describeText: {
      width: '70%',
      color: theme.textBackgroundBlack,
      fontSize: 18,
      textAlign: 'center',
    },
  });
