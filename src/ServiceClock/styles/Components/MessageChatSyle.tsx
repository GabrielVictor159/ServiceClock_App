import { StyleSheet } from "react-native";
import { Theme } from "../../provider/ThemeProvider";
import geral from "../Common/Geral";

export const createMessageChatStyle= (theme: Theme, isKeyboardHidden: boolean = true) =>
    StyleSheet.create({
        defaultLayout:{
            justifyContent:'flex-start'
        },
        header: {
            width:geral.windowWidth,
            backgroundColor:theme.inverseBackgroundHighlight,
            display:'flex',
            flexDirection:'row',
            alignItems:'center',
            gap:10,
            paddingHorizontal:20,
            paddingVertical:10,
            marginTop:25,
            elevation:5
        },
        backSymbol:{
            width:25,
            height:25,
            objectFit:'contain',
            tintColor:theme.inverseText
        },
        name:{
            fontSize:20,
            color:theme.inverseText
        },
        body:{
            width:geral.windowWidth,
            display:'flex',
            flexDirection:'column',
            height:isKeyboardHidden?'70%':'64%'
        },
        footer:{
            width:geral.windowWidth,
            display:'flex',
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            height:isKeyboardHidden?'10%':'15%',
            gap:10,
            paddingLeft:'10%',
            paddingRight:'10%'
        },
        inputView:{
            minWidth:'70%',
            minHeight:45,
            maxHeight:90,
            backgroundColor:"#E9E9E9",
            borderRadius:10,
            borderWidth:1,
            elevation:2,
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-around',
            alignItems:'center',
            gap:5,
        },
        input:{
            width:'85%',
            padding:10,
            flexGrow:1,
            flexWrap:'wrap',
            overflow:'scroll'
        },
        imageAttachFile:{
            width:30,
            height:30,
        },
        sendIconView:{
            backgroundColor:theme.themeColor,
            width:50,
            height:50,
            borderRadius:50,
            elevation:2,
            display:'flex',
            justifyContent:'center',
            alignItems:'center'
        },
        sendIcon:{
            width:'50%',
            height:'50%',
            objectFit:'contain',
            tintColor:'white'
        },
        line:{
            width:'100%',
            display:'flex',
            flexDirection:'row',
            alignItems:'center'
        },
        lineOtherUser:{
            justifyContent:'flex-start'
        },
        lineActualUser:{
            justifyContent:'flex-end'
        },
        modalOverlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
            width: '80%',
        },
        modalTitle: {
            fontSize: 18,
            marginBottom: 20,
        },
        modalOption: {
            fontSize: 16,
            color: '#007bff',
            marginBottom: 15,
        },
        modalCancel: {
            fontSize: 16,
            color: 'red',
        },
        selectedImage: {
            width: 100,
            height: 100,
            resizeMode: 'contain',
        },
        selectedFileView:{
            width:geral.windowWidth-70,
            height:200,
            backgroundColor:'white'
        }
    });
