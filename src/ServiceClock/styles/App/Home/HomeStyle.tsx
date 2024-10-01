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
      ...geral.createButton(theme)
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