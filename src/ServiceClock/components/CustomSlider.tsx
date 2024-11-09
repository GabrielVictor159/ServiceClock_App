import React, { useState, useEffect } from 'react';
import { View, PanResponder, StyleSheet, GestureResponderEvent } from 'react-native';

interface CustomSliderProps {
    value?: number;
    minimumValue?: number;
    maximumValue?: number;
    step?: number;
    minimumTrackTintColor?: string;
    maximumTrackTintColor?: string;
    thumbTintColor?: string;
    onValueChange?: (value: number) => void;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
    value = 0,
    minimumValue = 0,
    maximumValue = 1,
    step = 0.01,
    minimumTrackTintColor = 'blue',
    maximumTrackTintColor = '#d3d3d3',
    thumbTintColor = '#fff',
    onValueChange
}) => {
    const [sliderWidth, setSliderWidth] = useState(0);
    const [thumbPosition, setThumbPosition] = useState((value - minimumValue) / (maximumValue - minimumValue));

    const calculateValueFromPosition = (positionX: number) => {
        const newThumbPosition = Math.min(Math.max(positionX / sliderWidth, 0), 1);
        const newValue = minimumValue + newThumbPosition * (maximumValue - minimumValue);
        return Math.round(newValue / step) * step;
    };

    const handleBarPress = (event: GestureResponderEvent) => {
        const { locationX } = event.nativeEvent;
        const newValue = calculateValueFromPosition(locationX);
        setThumbPosition((newValue - minimumValue) / (maximumValue - minimumValue));

        if (onValueChange) {
            onValueChange(newValue);
        }
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            const newThumbPosition = Math.min(Math.max(gestureState.dx / sliderWidth + thumbPosition, 0), 1);
            const newValue = minimumValue + newThumbPosition * (maximumValue - minimumValue);
            const steppedValue = Math.round(newValue / step) * step;

            if (onValueChange) {
                onValueChange(steppedValue);
            }
            setThumbPosition(newThumbPosition);
        },
    });

    useEffect(() => {
        const initialPosition = (value - minimumValue) / (maximumValue - minimumValue);
        setThumbPosition(initialPosition);
    }, [value, minimumValue, maximumValue]);

    return (
        <View
            style={styles.container}
            onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
            onTouchStart={handleBarPress} 
        >
            <View
                style={[
                    styles.track,
                    { backgroundColor: maximumTrackTintColor },
                ]}
            >
                <View
                    style={[
                        styles.track,
                        {
                            backgroundColor: minimumTrackTintColor,
                            width: `${thumbPosition * 100}%`,
                        },
                    ]}
                />
            </View>

            <View
                style={[
                    styles.thumb,
                    {
                        backgroundColor: thumbTintColor,
                        left: `${thumbPosition * 100}%`,
                    },
                ]}
                {...panResponder.panHandlers}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 40,
        justifyContent: 'center',
        width: '100%',
    },
    track: {
        position: 'absolute',
        height: 4,
        borderRadius: 2,
        width: '100%',
    },
    thumb: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        marginTop: -8,
    },
});

export default CustomSlider;
