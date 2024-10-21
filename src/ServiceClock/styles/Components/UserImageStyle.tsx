import { StyleSheet } from "react-native";
import { Theme } from "../../provider/ThemeProvider";
import geral from "../Common/Geral";

export const createUserImageStyle= (theme: Theme) =>
    StyleSheet.create({
        box:{
            backgroundColor: theme.background,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            borderRadius: 200,
            borderWidth: 1,
        },
        image:{
            width:'100%',
            height:'100%',
            objectFit: 'cover',
            padding:5
        }
    });
