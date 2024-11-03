import { StyleSheet } from "react-native";
import { Theme } from "../../../provider/ThemeProvider";
import geral from '../../Common/Geral';


export const createUserCompanyStyle = (theme: Theme) =>
  StyleSheet.create({
    boxImage: {
      display: 'flex',
      flexDirection: 'row'
    },
    boxProperties: {
      width: geral.windowWidth - 70,
      minHeight: 400,
      backgroundColor: 'white',
      borderRadius: 20,
      borderWidth: 3,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'flex-start',
      padding: 20,
      elevation: 5
    },
    TextHighlight: {
      fontWeight: 'bold'
    },
    NormalText: {
      fontFamily: 'Roboto'
    },
    LineText: {
      maxWidth:'100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap:'wrap',
      gap: 10
    },
    ImgEditLine: {
      width: 20,
      height: 20,
      objectFit: 'contain',
      tintColor: theme.themeColor
    },
    selectBox: {
      borderWidth: 2,
      borderColor: '#e3e3e3',
      flexGrow: 1,
      borderRadius: 10,
      overflow: 'hidden'
    },
    pickerLabel: {
      color: '#707070',
    },
    select: {
      height: 55,
      paddingHorizontal: 10,
    },
    selectLine: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center'
    },
    logoutIcon:{
      width:60,
      height:60,
      elevation:5
    },
    logoutView:{
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      gap:5
    },
    textLogout:{
      fontWeight:'bold',
      fontSize:17,
      color:theme.redColor
    }
  });
