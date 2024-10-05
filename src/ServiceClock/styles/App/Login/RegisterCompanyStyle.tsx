import { StyleSheet } from "react-native";
import geral from "../../Common/Geral";
import { Theme } from '../../../provider/ThemeProvider';
import { rgbaColor } from "react-native-reanimated/lib/typescript/Colors";

export const createRegisterCompanyStyle = (theme: Theme) =>
  StyleSheet.create({
    Input: {
      height: 40,
      width: 200,
      backgroundColor: theme.inputBackground,
      borderColor: 'gray',
      borderWidth: 2,
      marginTop: 10,
      paddingHorizontal: 10,
      elevation: 1
    },
    InputError: {
      borderColor: 'red',
    },
    InputContainer: {
      height: 450,
      width: '100%',
      padding: 20,
    },
    label: {
      color: theme.normalText
    },
    Button: {
      ...geral.createButton(theme)
    },
    ButtonText: {
      color: theme.highlightedText,
      fontSize: 18,
    },
    IconContainer: {
      width: 150,
      height: 150,
      backgroundColor: 'rgba(150, 150, 150, 1)',
      padding: 20,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      elevation:2
    },
    Icon: {
      width: 120,
      height: 120,
    },
    selectButton: {
      width:40,
      height:40,
      backgroundColor: theme.inputBackground,
      borderColor: 'gray',
      borderWidth: 2,
      marginTop: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }
  });
