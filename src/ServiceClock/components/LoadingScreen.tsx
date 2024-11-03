import React, { useEffect, useRef } from 'react';
import { Text, View, Image, Animated, Modal } from 'react-native';
import { useLoading } from '../provider/IsLoadingProvider';

interface LoadingScreenProps {}

const LoadingScreen: React.FC<LoadingScreenProps> = () => {
    const { isLoading } = useLoading();
    const widthAnim = useRef(new Animated.Value(0)).current;
    const fullWidth = 100;

    useEffect(() => {
        const startAnimation = () => {
            Animated.sequence([
                Animated.timing(widthAnim, {
                    toValue: fullWidth,
                    duration: 1500,
                    useNativeDriver: false,
                }),
                Animated.delay(2000),
                Animated.timing(widthAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: false,
                }),
            ]).start(() => startAnimation());
        };

        startAnimation();
    }, [widthAnim]);

    return (
        <Modal
            transparent={true}
            animationType="none"
            visible={isLoading}
        >
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundColor: 'black',
                    opacity: 0.8,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10000
                }}
            >
                <Image
                    source={require('../assets/loading_animation_400_400.gif')}
                    style={{ width: 200, height: 200, position: 'relative' }}
                />
                <View
                    style={{
                        overflow: 'hidden',
                        width: 100,
                        alignItems: 'flex-start',
                        transform: [{ translateY: -50 }, { translateX: 15 }]
                    }}
                >
                    <Animated.View style={{ width: widthAnim.interpolate({
                        inputRange: [0, fullWidth],
                        outputRange: ['0%', '100%']
                    }), display: 'flex', overflow: 'hidden' }}>
                        <Text
                            style={{ fontSize: 20, fontWeight: 'bold', color: '#03d3fc' }}
                            numberOfLines={1}
                        >
                            Loading...
                        </Text>
                    </Animated.View>
                </View>
            </View>
        </Modal>
    );
};

export default LoadingScreen;
