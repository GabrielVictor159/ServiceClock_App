import { StyleSheet, Keyboard } from "react-native";
import { Theme } from "../../../provider/ThemeProvider";
import geral from '../../Common/Geral';
import DefaultLayout from "../../../components/DefaultLayout";

export const createMensagensCompanyStyle = (theme: Theme, isKeyboardHidden: boolean = true) => {
    return StyleSheet.create({
        defaultLayout:{
            justifyContent:isKeyboardHidden?'flex-start':'center'
        },
        buttonNewClient:{
            marginTop:10,
            width:200,
            display:isKeyboardHidden? 'flex':'none'
        },
        icon:{
            width:100,
            height:100,
            display:isKeyboardHidden? 'flex':'none'
        },
        boxInput:{
            width: geral.windowWidth -40,
            display:'flex',
            flexDirection:'row',
            gap:5,
            backgroundColor:'white',
            borderWidth:3,
            borderRadius:10,
            justifyContent:'center',
            alignItems:'center',
            padding:10,
            elevation:5,
            marginTop:30
        },
        input:{
            width:'70%',
            backgroundColor:'#ebebeb',
            height:40,
            borderRadius:10,
            padding:10,
        },
        boxClients: {
            width: geral.windowWidth - 40,
            height: isKeyboardHidden ? 400 : 170,
            borderWidth: 3,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 10,
            elevation: 5,
        },
        TextHighlight: {
            fontWeight: 'bold',
        },
        NormalText: {
            fontFamily: 'Roboto',
        },
        lineText: {
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            width: '100%',
            flexWrap: 'wrap',
        },
        lineInformation: {
            width: '100%',
            flexDirection: 'row',
            gap: 10,
            display: 'flex',
        },
        columnInformation: {
            flexDirection: 'column',
            gap: 10,
            display: 'flex',
        },
        lineButton: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
            marginTop: 10,
            paddingBottom: 10,
            borderBottomWidth: 2,
        },
        button: {
            flexGrow: 0,
            backgroundColor: '#469bc6',
            padding: 10,
            borderRadius: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        textButton: {
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
};
