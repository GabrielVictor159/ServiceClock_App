import { StyleSheet } from "react-native";
import { Theme } from "../../../provider/ThemeProvider";
import geral from "../../Common/Geral";


export const createServiceStyle = (theme: Theme) =>
  StyleSheet.create({
    icon: {
      width: 200,
      height: 200,
    },
    headerText: {
      fontSize: 30,
      color: theme.normalText,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 20
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
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '80%',
      alignItems: 'center',
      gap: 10,
    },
  });
