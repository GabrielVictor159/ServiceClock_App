import React from "react";
import { View, Image, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../provider/ThemeProvider";
import { createUserImageStyle } from "../styles/Components/UserImageStyle";
import { Environment } from '../Environment';

interface UserImageProps {
    width: number; 
    height: number;
    source: string | null;
    styleBox?: ViewStyle | null; // Mude para ViewStyle
}

const UserImage: React.FC<UserImageProps> = ({
    width,
    height,
    source,
    styleBox
}) => {
    const { theme } = useTheme();
    const styles = createUserImageStyle(theme);
    const localImage = require('../assets/user.png');
    const environment = new Environment();

    return (
        <View style={[styles.box, { width, height }, styleBox]}>
            <Image
                source={source === null ? localImage : { uri: environment.imageContainer + source }}
                style={styles.image}
            />
        </View>
    );
};

export default UserImage;
