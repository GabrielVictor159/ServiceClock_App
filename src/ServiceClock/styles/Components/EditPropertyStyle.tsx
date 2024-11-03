import { StyleSheet } from "react-native";
import { Theme } from "../../provider/ThemeProvider";
import geral from "../Common/Geral";

export const createEditPropertyStyle= (theme: Theme) =>
    StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            width: 300,
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 10,
            elevation: 5,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 20,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
        },
        button:{
            paddingHorizontal:20,
            paddingVertical:10,
            backgroundColor:theme.themeColorHighlitch,
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            borderRadius:5,
            elevation:5
        },
        textButton:{
            color:'white',
            fontWeight:'bold'
        }
    });
