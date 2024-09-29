import { Dimensions, Keyboard } from 'react-native';
const windowWidth = Dimensions.get('window').width;
 const windowHeight = Dimensions.get('window').height;
 
function keyboardStatus(callback:any){
    const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          callback(false)
        }
      );
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          callback(true)
        });
}   

const shadow ={
  shadowColor: '#000',
  shadowOffset: { width: 5, height: 5 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 10,
}

 const geral ={
    windowHeight,
    windowWidth,
    keyboardStatus,
    shadow: shadow
 }


 export default geral;