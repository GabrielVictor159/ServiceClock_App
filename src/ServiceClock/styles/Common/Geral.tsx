import { Dimensions, Keyboard } from 'react-native';
import { Theme } from '../../provider/ThemeProvider';
const windowWidth = Dimensions.get('window').width;
 const windowHeight = Dimensions.get('window').height;
 
 function keyboardStatus(callback:any) {
  const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => callback(false)
  );
  const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => callback(true)
  );

  return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
  };
}

const shadow ={
  shadowColor: '#000',
  shadowOffset: { width: 5, height: 5 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 10,
}
const createButton =(theme:Theme)=>{
     return { backgroundColor: theme.themeColor,
      color: theme.highlightedText,
      padding: 10,
      borderRadius: 5,
      width: 200,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...shadow,
    }
}

 const geral ={
    windowHeight,
    windowWidth,
    keyboardStatus,
    shadow: shadow,
    createButton(theme:Theme):any{
      return createButton(theme);
    }
 }


 export default geral;