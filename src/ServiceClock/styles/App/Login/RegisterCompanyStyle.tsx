import { StyleSheet } from "react-native";
import geral from "../../Common/Geral";
import { Theme } from '../../../provider/ThemeProvider';
import { rgbaColor } from "react-native-reanimated/lib/typescript/Colors";

export const createRegisterCompanyStyle = (theme: Theme) =>
  StyleSheet.create({
    Input: {
      height: 50,
      width: 200,
      backgroundColor: theme.inputBackground,
      borderColor: 'gray',
      borderWidth: 2,
      paddingHorizontal: 10,
      elevation: 1,
      borderRadius:10,
      marginTop:10
    },
    InputError: {
      borderColor: 'red',
    },
    InputContainer: {
      height: 450,
      width: '100%',
      padding: 20,
      borderRadius:10
    },
    label: {
      color: theme.normalText
    },
    line:{
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      marginTop:20
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
      padding: 20,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    Icon: {
      width: 200,
      height: 200,
      elevation:5
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
      borderRadius:10
    }
  });
