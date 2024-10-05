import { StyleSheet } from "react-native";
import { Theme } from "../../provider/ThemeProvider";

export const createDefaultLayoutStyle= (theme: Theme) =>
    StyleSheet.create({
        body: {
            flex:1,
            backgroundColor: theme.background,
            justifyContent: 'center',
            alignItems: 'center'
        },
        languageButton: {
            gap:0,
            width: 120,
            justifyContent: 'center',
            alignItems: 'center',
          },
          boxOptions:{
            position: 'absolute', 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center', 
            top: 70,  
            gap: 5,
            backgroundColor:'rgba(14,108,185,0.9)',
            borderRadius:20,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
            zIndex:1
          },
          ButtonOptionsMenu:{
            width:40,
            height:30,
            display: 'flex',
            justifyContent: 'center',
          },
          ButtonOptionsMenuText:{
            color:theme.highlightedText,
            fontSize: 30,
            fontWeight: 'bold',
            transform: [{ translateY: -7 }]
          }
    });
