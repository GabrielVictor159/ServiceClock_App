import { StyleSheet } from "react-native";
import geral from "../../Common/Geral";
import { Theme } from '../../../provider/ThemeProvider';

export const createLoginStyle = (theme: Theme) =>
  StyleSheet.create({
    Input: {
        height: 40,
        width:200,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        paddingHorizontal: 10,
    },
   
  });
