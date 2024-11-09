import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { useTheme } from '../provider/ThemeProvider';
import CustomSlider from './CustomSlider';

interface AudioPlayerProps {
    audioUri: string;
    onFinish?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUri, onFinish }) => {
    const { theme } = useTheme();

    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackPosition, setPlaybackPosition] = useState(0);
    const [playbackDuration, setPlaybackDuration] = useState(0);
    const [isBuffering, setIsBuffering] = useState(false);

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.isLoaded) {
            setPlaybackPosition(status.positionMillis);
            setPlaybackDuration(status.durationMillis);

            if (status.didJustFinish && onFinish) {
                onFinish();
            }
        }
    };

    const playAudio = async () => {
        if (sound === null) {
            const { sound } = await Audio.Sound.createAsync(
                { uri: audioUri },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );
            setSound(sound);
            await sound.playAsync().catch((error) => console.log('Error playing audio:', error));
            setIsPlaying(true);
        } else {
            await sound.playAsync();
            setIsPlaying(true);
        }
    };

    const stopAudio = async () => {
        if (sound) {
            try {
                await sound.stopAsync();
                setIsPlaying(false);
            } catch (error) {
                console.log('Error stopping audio:', error);
            }
        }
    };

    const toggleAudio = async () => {
        if (isPlaying) {
            stopAudio();
        } else {
            playAudio();
        }
    };

    const onSliderValueChange = (value: number) => {
        if (sound) {
            sound.setPositionAsync(value);
        }
    };

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (isPlaying && playbackPosition < playbackDuration) {
                setPlaybackPosition((prevPosition) => prevPosition + 1000);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isPlaying, playbackPosition, playbackDuration]);

    return (
        <View style={{ padding: 20, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity onPress={toggleAudio}>
                <View style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: theme.themeColor, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        style={{ width: 20, height: 20, objectFit: 'contain', tintColor: theme.inverseText }}
                        source={isPlaying ? require("../assets/pause.png") : require("../assets/play-button-arrowhead.png")} />
                </View>
            </TouchableOpacity>

            {isBuffering && <Text>Buffering...</Text>}

            <CustomSlider
                value={playbackPosition}
                minimumValue={0}
                maximumValue={playbackDuration}
                onValueChange={onSliderValueChange}
                thumbTintColor="#007AFF" // Cor da esfera (thumb)
                minimumTrackTintColor="#007AFF" // Cor da barra preenchida
                maximumTrackTintColor="#E0E0E0" // Cor da barra não preenchida
                
            />

        </View>
    );
};

export default AudioPlayer;
