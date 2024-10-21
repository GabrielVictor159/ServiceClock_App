import { StyleSheet } from "react-native";
import { Theme } from "../../provider/ThemeProvider";
import geral from "../Common/Geral";

export const createAppointmentsCalendarStyle = (theme: Theme) =>
    StyleSheet.create({
        image:{
            width:170,
            height:170,
        },
        Calendar: {
          borderWidth: 2,
          elevation: 5,
          width: geral.windowWidth - 50,
          backgroundColor: 'white',
          borderRadius:20,
          overflow: 'hidden',
        },
        descriptionBox:{
            width: '80%',
            padding: 10,
            backgroundColor:'white',
            borderWidth: 2,
            borderColor: 'black',
            borderRadius: 10,
            elevation: 5,   
            marginTop: 20,
        },
        textHeader: {
          fontSize: 30,
          color: theme.normalText,
          fontWeight: 'bold',
          marginBottom: 10,
        },
        linePicker: {
          borderWidth: 2,
          borderRadius: 10,
          overflow: 'hidden',
          elevation: 5,
        },
        picker: {
          fontSize: 16,
          paddingVertical: 12,
          paddingHorizontal: 10,
          width: 250,
          borderWidth: 2,
          borderColor: 'black',
          backgroundColor: 'white',
          paddingRight: 30,
        },
    });
