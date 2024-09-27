import { StyleSheet } from "react-native";
import color from "../Common/Color";
const DefaultLayoutStyle = StyleSheet.create({
    body: {
        flex:1,
        backgroundColor: color.background,
        justifyContent: 'center',
        alignItems: 'center'

    },
})
export { DefaultLayoutStyle}