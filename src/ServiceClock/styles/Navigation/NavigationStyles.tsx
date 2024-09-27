import { DefaultTheme } from '@react-navigation/native';
import color from '../Common/Color';

const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: color.background, 
    },
};

export { navigationTheme };
