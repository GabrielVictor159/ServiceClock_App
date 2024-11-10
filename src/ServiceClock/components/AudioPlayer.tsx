import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { useTheme } from '../provider/ThemeProvider';

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
    }, []);


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
            <View
            style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: 'gray', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Image 
                 style={{ width: 30, height: 30, objectFit: 'contain', tintColor: 'white' }}
                 source={require("../assets/medium-volume.png")}/>
            </View>
            <View style={{width:'60%',height:35, overflow:'hidden', display:'flex',justifyContent:'center',alignItems:'center'}}>
            <Slider
                value={playbackPosition}
                minimumValue={0}
                maximumValue={playbackDuration}
                onValueChange={onSliderValueChange}
                minimumTrackTintColor={theme.themeColor}
                maximumTrackTintColor="gray"
                thumbTintColor={theme.themeColor}
                style={{width:'65%',transform: [{ scaleY: 2 },{scaleX:2}]}}
                
            />
            </View>
            <TouchableOpacity onPress={toggleAudio}>
                <View style={{ width: 40, height: 40, borderRadius: 50, backgroundColor: theme.themeColor, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        style={{ width: 20, height: 20, objectFit: 'contain', tintColor: 'white' }}
                        source={isPlaying ? require("../assets/pause.png") : require("../assets/play-button-arrowhead.png")} />
                </View>
            </TouchableOpacity>

        </View>
    );
};

export default AudioPlayer;
