import { StyleSheet } from "react-native";
import { Theme } from "../../provider/ThemeProvider";
import geral from "../Common/Geral";

export const createAppointmentsViewStyle = (theme: Theme) =>
    StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)", 
        },
        background:{
            width: geral.windowWidth,
            height: geral.windowHeight,
            position: 'absolute'
        },
        modalView: {
            width: geral.windowWidth - 50,
            maxHeight: geral.windowHeight - 300, 
            margin: 20,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 10,
            paddingTop: 20,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            overflow:'scroll'
        },
        contentContainer: {
            paddingBottom: 20, 
        },
        boxLine: {
            paddingTop: 10,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            paddingBottom: 20,
        },
        textBox: {
            width: '80%',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            gap: 5,
            marginLeft: 10,
        },
        textLine: {
            width: '100%',
        },
        ButtonBox: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            marginTop: 10,
        },
        Button: {
            width: 100,
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.themeColor,
            color: theme.highlightedText,
            borderRadius: 20,
        },
        ButtonAddAppointment:{
            width: 200,
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.themeColor,
            color: theme.highlightedText,
            borderRadius: 20,
            marginTop: 20,
        },
        ButtonText: {
            color: theme.highlightedText,
            fontWeight: 'bold',
        },
        inputHourBox:{
            borderWidth: 1,
            borderRadius:10
        },
        inputHour:{
            height: 50,
            width: 110,
        },
        inputComment:{
            borderRadius: 10,
            borderWidth: 1, 
            padding: 10, 
            flex: 1 
        },
        ButtonLine:{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap:10,
        },
        buttonInputs:{
            width: 100,
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.themeColor,
            color: theme.highlightedText,
            borderRadius: 20,
        }
    });
