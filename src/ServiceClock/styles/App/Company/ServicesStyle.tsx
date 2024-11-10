import { StyleSheet } from "react-native";
import { Theme } from "../../../provider/ThemeProvider";
import geral from "../../Common/Geral";


export const createServiceStyle = (theme: Theme, isKeyboardHidden:boolean) =>
  StyleSheet.create({
    icon: {
      width: 150,
      height: 150,
    },
    headerText: {
      fontSize: 30,
      color: theme.normalText,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 10
    },
    boxServices: {
      width: geral.windowWidth - 70,
      height: 400,
      borderRadius: 20,
      backgroundColor: 'white',
      borderWidth: 3,
      marginTop: 20,
      elevation: 5,
    },
    addServiceLine: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
      paddingBottom: 10,
    },
    addServiceButton: {
      backgroundColor: '#469bc6',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    addServiceText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
