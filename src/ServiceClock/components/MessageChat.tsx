import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Modal, StyleSheet } from 'react-native';
import { createMessageChatStyle } from '../styles/Components/MessageChatSyle';
import { useTheme } from '../provider/ThemeProvider';
import { useKeyboard } from '../provider/KeyboardProvider';
import UserImage from './UserImage';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { useEspecialButtons } from '../provider/EspecialButtonsProvider';
import DefaultLayout from './DefaultLayout';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { MessageType } from '../services/MessageService';
import VideoPlayer from 'expo-video-player'
import { Audio, ResizeMode, Video } from 'expo-av';
import AudioPlayer from './AudioPlayer';
import mimeDb from 'mime-db';
import Toast from 'react-native-toast-message';
import VideoPlayerWithControls from './VideoPlayerWithControls';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface MessageChatProps {
    otherUser: any;
    onBack?: () => void;
}

const MessageChat: React.FC<MessageChatProps> = ({ otherUser, onBack }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { isKeyboardHidden } = useKeyboard();
    const { isEspecialButtonsVisible, setIsEspecialButtonsVisible } = useEspecialButtons();
    const styles = createMessageChatStyle(theme, isKeyboardHidden);

    const [message, setMessage] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [selectedFileType, setSelectedFileType] = useState<MessageType | null>();

    const [modalVisible, setModalVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setIsEspecialButtonsVisible(false);
            return () => {
                setIsEspecialButtonsVisible(true);
            };
        }, [])
    );

    const getAllowedFileTypes = () => {
        return Object.keys(mimeDb).filter(type =>
            !type.startsWith('image/') && !type.startsWith('video/')
        );
    };

    const MAX_FILE_SIZE = 80 * 1024 * 1024;

    const handleFilePicker = async () => {
        try {
            const allowedTypes = getAllowedFileTypes();

            const result = await DocumentPicker.getDocumentAsync({
                type: allowedTypes,
            });

            if (!result.canceled) {
                const { uri, mimeType, name, size } = result.assets[0];

                if (size === undefined) {
                    Toast.show({
                        type: 'error',
                        text1: 'Erro',
                        text2: t("PickerErrorFileType"),
                    });
                    return;
                }

                if (size > MAX_FILE_SIZE) {
                    Toast.show({
                        type: 'error',
                        text1: 'Erro',
                        text2: t("PickerFileSize"),
                    });
                    return;
                }

                const isAudio = mimeType != undefined ? mimeType.startsWith('audio/') : false;
                setSelectedFileType(isAudio ? MessageType.Audio : MessageType.File);
                setSelectedFile({ uri, name });
            }
        } catch (error) {
            console.log('Error picking file:', error);
        }
    };

    const handleImagePicker = async () => {
        try {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permission.granted) {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                const { uri, type, fileName, fileSize } = result.assets[0];

                if (fileSize === undefined) {
                    Toast.show({
                        type: 'error',
                        text1: 'Erro',
                        text2: t("PickerErrorFileType"),
                    });
                    return;
                }

                if (fileSize > MAX_FILE_SIZE) {
                    Toast.show({
                        type: 'error',
                        text1: 'Erro',
                        text2: t("PickerFileSize"),
                    });
                    return;
                }

                setSelectedFileType(type === 'video' ? MessageType.Video : MessageType.Img);
                setSelectedFile({ uri, name: fileName });
            }
        } else {
            console.log('Permission to access media library is required!');
        }}
        catch{}
    };

    const showPickerModal = () => {
        setModalVisible(true);
    };

    const closePickerModal = () => {
        setModalVisible(false);
    };

    const renderFilePreview = () => {
        if (!selectedFile || !selectedFile.uri) {
            return null;
        }
    
        if (selectedFileType === MessageType.Img) {
            return <Image source={{ uri: selectedFile.uri }} style={styles.selectedImage} />;
        } else if (selectedFileType === MessageType.Video) {
            return (
                <VideoPlayerWithControls
                    width={200}
                    height={100}
                    timeText={false}
                    videoUri={selectedFile.uri}
                />
            );
        } else if (selectedFileType === MessageType.Audio) {
            return (
                <AudioPlayer
                    audioUri={selectedFile.uri}
                />
            );
        } else if (selectedFileType === MessageType.File) {
            return (
                <View style={{ width: 200, display: 'flex', overflow: 'scroll', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ width: 50, height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'gray', borderRadius: 50 }}>
                        <Image style={{ width: 30, height: 30, objectFit: 'contain', tintColor: "white" }} source={require("../assets/google-docs.png")} />
                    </View>
                    <Text style={{ fontSize: 20 }}>{selectedFile.name}</Text>
                </View>
            );
        } else {
            return null;
        }
    };
    


    return (
        <DefaultLayout containerStyle={styles.defaultLayout}>
            <View style={styles.header}>
                {onBack !== undefined ? (
                    <TouchableOpacity onPress={() => { onBack(); }}>
                        <Image style={styles.backSymbol} source={require("../assets/arrow.png")} />
                    </TouchableOpacity>
                ) : null}
                <UserImage width={50} height={50} source={otherUser.image} />
                <Text style={styles.name}>{otherUser.name}</Text>
            </View>

            <View style={styles.body}>
                <ScrollView>

                </ScrollView>
            </View>

            <View style={styles.footer}>
                <View style={{ ...styles.inputViewColumn }}>
                    {selectedFile && (
                        <View style={styles.selectedFileView}>
                            <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <TouchableOpacity onPress={()=>{setSelectedFileType(null); setSelectedFile(null); }}>
                                    <Image style={{ width: 15, height: 15, objectFit: 'contain', tintColor: theme.themeColor }} source={require("../assets/close.png")} />
                                </TouchableOpacity>
                            </View>
                            {renderFilePreview()}
                        </View>
                    )}
                    <View style={styles.inputView}>
                        <TextInput
                            placeholder={t("Message")}
                            value={message}
                            style={styles.input}
                            onChangeText={(event: string) => setMessage(event)}
                            multiline={true}
                        />
                        <TouchableOpacity onPress={showPickerModal}>
                            <Image
                                style={styles.imageAttachFile}
                                source={require("../assets/attach-file.png")}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity>
                    <View style={styles.sendIconView}>
                        <Image
                            style={styles.sendIcon}
                            source={require("../assets/message.png")}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={closePickerModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t("PickerType")}</Text>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => { handleImagePicker(); closePickerModal(); }}>
                                <Image style={{ width: 50, height: 50, tintColor: theme.themeColor, objectFit: 'cover' }} source={require("../assets/image-galery.png")} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { handleFilePicker(); closePickerModal(); }}>
                                <Image style={{ width: 50, height: 40, tintColor: theme.themeColor, objectFit: 'contain' }} source={require("../assets/google-docs.png")} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={closePickerModal}>
                            <Text style={styles.modalCancel}>{t("Cancel")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Toast />
        </DefaultLayout>
    );
};

export default MessageChat;
