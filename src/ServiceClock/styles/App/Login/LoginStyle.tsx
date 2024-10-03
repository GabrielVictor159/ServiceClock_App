import { StyleSheet } from "react-native";
import geral from "../../Common/Geral";
import { Theme } from '../../../provider/ThemeProvider';

export const createLoginStyle = (theme: Theme) =>
  StyleSheet.create({
    Input: {
        height: 40,
        width:200,
        backgroundColor:theme.inputBackground,
        borderColor: 'gray',
        borderWidth: 2,
        marginTop: 10,
        paddingHorizontal: 10,
        elevation:1
    },
    label:{
      color:theme.normalText
    },
    Button: {
      ...geral.createButton(theme)
    },
    ButtonText: {
      color: theme.highlightedText,
      fontSize: 18,
    },
  });
