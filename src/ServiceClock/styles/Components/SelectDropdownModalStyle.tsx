import { StyleSheet } from "react-native";
import { Theme } from "../../provider/ThemeProvider";

export const createSelectDropdownModalStyle= (theme: Theme) =>
    StyleSheet.create({
        modal:{
            margin: 0,
            alignItems: undefined,
            justifyContent: undefined,
          },
          modalOverlay: {
            flex: 1,
            height: '100%',
            margin:0,
            justifyContent: 'center',
            alignItems: 'center',
          },
          modalContent: {
            width: '80%',
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 10,
          },
          item: {
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
          },
          itemText: {
            fontSize: 18,
          },
    });
