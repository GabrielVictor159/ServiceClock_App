import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Modal } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import Slider from '@react-native-community/slider';
import * as ScreenOrientation from 'expo-screen-orientation';

interface VideoPlayerWithControlsProps {
    width: number;
    height: number;
    videoUri: string;
    timeText?: boolean;
}

const VideoPlayerWithControls: React.FC<VideoPlayerWithControlsProps> = ({ width, height, videoUri, timeText = true }) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    const videoRef = useRef<Video | null>(null);
    const fullscreenVideoRef = useRef<Video | null>(null);
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

    useEffect(() => {
        if (isFullscreen) {
            setOrientation('landscape');
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        } else {
            setOrientation('portrait');
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }
    }, [isFullscreen]);

    useEffect(() => {
        const updateStatus = (status: any) => {
            if (status.isLoaded) {
                if (status.durationMillis) setDuration(status.durationMillis / 1000);
                setCurrentTime(status.positionMillis / 1000);
                setIsPlaying(status.isPlaying);
            }
        };

        if (videoRef.current) {
            videoRef.current.setOnPlaybackStatusUpdate(updateStatus);
        }
        if (fullscreenVideoRef.current) {
            fullscreenVideoRef.current.setOnPlaybackStatusUpdate(updateStatus);
        }
    }, [videoUri]);

    const togglePlayPause = () => {
        if (isPlaying) {
            videoRef.current?.pauseAsync();
            fullscreenVideoRef.current?.pauseAsync();
        } else {
            videoRef.current?.playAsync();
            fullscreenVideoRef.current?.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSliderChange = async (value: number) => {
        setCurrentTime(value);
        await videoRef.current?.setPositionAsync(value * 1000);
        await fullscreenVideoRef.current?.setPositionAsync(value * 1000);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const toggleOrientation = async () => {
        if (orientation === 'portrait') {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            setOrientation('landscape');
        } else {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            setOrientation('portrait');
        }
    };

    const renderControls = (fullscreen: boolean) => (
        <View style={styles.controls}>
            <View style={[styles.controlButtons, { gap: fullscreen ? width * 0.1 : width * 0.02 }]}>
                <TouchableOpacity onPress={togglePlayPause}>
                    <Image
                        style={{ width: width * 0.09, height: width * 0.09, objectFit: 'contain', tintColor: 'white' }}
                        source={isPlaying ? require("../assets/pause.png") : require("../assets/play-button-arrowhead.png")}
                    />
                </TouchableOpacity>
                {timeText &&
                    <Text style={[styles.timeText, { fontSize: width * 0.07 }]}>
                        {formatTime(currentTime)}
                    </Text>
                }
                <View style={[styles.slider, { height: height * 0.3, overflow: 'hidden' }]}>
                    <Slider
                        minimumValue={0}
                        maximumValue={duration}
                        value={currentTime}
                        onValueChange={handleSliderChange}
                        minimumTrackTintColor="white"
                        maximumTrackTintColor="gray"
                        thumbTintColor="white"
                        style={{ width: '60%', transform: [{ scaleY: 2 }, { scaleX: 2 }] }}
                    />
                </View>
                {timeText &&
                    <Text style={[styles.timeText, { fontSize: width * 0.07 }]}>
                        {formatTime(duration)}
                    </Text>
                }
                {
                    fullscreen &&
                    <TouchableOpacity onPress={async () => { await toggleOrientation() }}>
                        <Image
                            style={{ width: width * 0.09, height: width * 0.09, objectFit: 'contain', tintColor: 'white' }}
                            source={require("../assets/smartphone.png")}
                        />
                    </TouchableOpacity>
                }
                <TouchableOpacity onPress={toggleFullscreen}>
                    <Image
                        style={{ width: width * 0.09, height: width * 0.09, objectFit: 'contain', tintColor: 'white' }}
                        source={fullscreen ? require("../assets/exit-fullscreen.png") : require("../assets/fullscreen.png")}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={[{ width: width, height: height }, styles.container]}>
            <Video
                ref={videoRef}
                source={{ uri: videoUri }}
                style={styles.video}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={isPlaying}
                isLooping
            />
            {renderControls(false)}
            <FullscreenVideoPlayer
                isFullscreen={isFullscreen}
                fullscreenVideoRef={fullscreenVideoRef}
                videoUri={videoUri}
                isPlaying={isPlaying}
                toggleFullscreen={toggleFullscreen}
                orientation={orientation}
            >
                {renderControls(true)}
            </FullscreenVideoPlayer>

        </View>
    );
};

interface FullscreenVideoPlayerProps {
    isFullscreen: boolean;
    fullscreenVideoRef: any;
    videoUri: any;
    isPlaying: boolean;
    children: React.ReactNode;
    toggleFullscreen: () => void;
    orientation: 'portrait' | 'landscape'
}

const FullscreenVideoPlayer: React.FC<FullscreenVideoPlayerProps> = ({
    isFullscreen,
    fullscreenVideoRef,
    videoUri,
    isPlaying,
    children,
    toggleFullscreen,
    orientation
}) => {

    return (
        <Modal visible={isFullscreen} transparent={false} animationType="slide">
            <View style={styles.fullscreenContainer}>
                <Video
                    ref={fullscreenVideoRef}
                    source={{ uri: videoUri }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={isPlaying}
                    isLooping
                />
                {children}
            </View>
        </Modal>
    );
};

const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    controls: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    timeText: {
        color: 'white',
    },
    slider: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
    },
    controlButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 5,
        marginBottom: "1%",
    },
    fullscreenContainer: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default VideoPlayerWithControls;
