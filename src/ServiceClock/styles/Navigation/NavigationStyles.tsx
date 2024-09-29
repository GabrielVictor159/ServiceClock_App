import { DefaultTheme } from '@react-navigation/native';
import { Theme } from '../../provider/ThemeProvider';

export const createNavigationTheme = (theme: Theme) =>
{
  return  {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.background, 
    },
};
}


