import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useTheme } from "../provider/ThemeProvider";
import { createUserImageStyle } from "../styles/Components/UserImageStyle";
import { Environment } from '../Environment';

interface UserImageProps {
    width: number; 
    height: number;
    source: string | null;
}

const UserImage: React.FC<UserImageProps> = ({
    width,
    height,
    source,
}) => {

    const { theme } = useTheme();
    const styles = createUserImageStyle(theme);
    const localImage = require('../assets/user.png');
    const environment = new Environment();

    return (
        <View style={{ ...styles.box, width: width, height: height }}>
            <Image
                source={source === null ? localImage:{uri: environment.imageContainer + source}}
                style={styles.image}
            />
        </View>
    );
};

export default UserImage;
