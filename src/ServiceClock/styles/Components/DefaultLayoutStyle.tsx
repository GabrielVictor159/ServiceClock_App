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
    });
