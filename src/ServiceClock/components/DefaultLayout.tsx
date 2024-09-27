
import React from 'react';
import { Text, View } from 'react-native';
import { DefaultLayoutStyle } from '../styles/Components/DefaultLayoutStyle';
interface DefaultLayoutProps{
    children: React.ReactNode;
    containerStyle?: object;
}
const DefaultLayout: React.FC<DefaultLayoutProps> = ({children, containerStyle}) => {
  return (
      <>
    <View style={[DefaultLayoutStyle.body, containerStyle]}>
      {children}
    </View>
      </>
  );
};

export default DefaultLayout;
