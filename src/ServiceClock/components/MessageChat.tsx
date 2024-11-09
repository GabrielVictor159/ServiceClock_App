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
import { Audio, Video } from 'expo-av'; // Importando corretamente o Audio do expo-av
import { getAudioMimeTypes } from '../utils/MimeTypes';
import AudioPlayer from './AudioPlayer';

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
    const [selectedFileType, setSelectedFileType] = useState<MessageType>();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);  // Novo estado para controlar a reprodução

    const [modalVisible, setModalVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setIsEspecialButtonsVisible(false);
            return () => {
                setIsEspecialButtonsVisible(true);
            };
        }, [])
    );

    const handleFilePicker = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
            });

            if (!result.canceled) {
                const { uri, mimeType, name } = result.assets[0];
                setSelectedFileType(getAudioMimeTypes().find(e => e === mimeType) !== null ? MessageType.Audio : MessageType.File);
                setSelectedFile({ uri, name: name });
            }
        } catch (error) {
            console.log('Error picking file:', error);
        }
    };

    const handleImagePicker = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permission.granted) {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                const { uri, type, fileName } = result.assets[0];
                setSelectedFileType(type === 'video' ? MessageType.Video : MessageType.Img);
                setSelectedFile({ uri, name: fileName });
            }
        } else {
            console.log('Permission to access media library is required!');
        }
    };

    const showPickerModal = () => {
        setModalVisible(true);
    };

    const closePickerModal = () => {
        setModalVisible(false);
    };

    const renderFilePreview = () => {
        if (selectedFileType === MessageType.Img) {
            return <Image source={{ uri: selectedFile.uri }} style={styles.selectedImage} />;
        } else if (selectedFileType === MessageType.Video) {
            return (
                <Video
                    source={{ uri: selectedFile.uri }}
                    style={styles.selectedImage}
                    useNativeControls
                    isLooping
                />
            );
        } else if (selectedFileType === MessageType.Audio) {
            return (
                <View>
                    <AudioPlayer
                        audioUri={selectedFile.uri}
                    />
                </View>
            );
        } else if (selectedFileType === MessageType.File) {
            return <Text>{selectedFile.name}</Text>;
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
                    {selectedFile && (
                        <View style={styles.selectedFileView}>
                            {renderFilePreview()}
                        </View>
                    )}
                </ScrollView>
            </View>

            <View style={styles.footer}>
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
                        <Text style={styles.modalTitle}>Escolha o tipo de arquivo</Text>
                        <TouchableOpacity onPress={() => { handleImagePicker(); closePickerModal(); }}>
                            <Text style={styles.modalOption}>Selecionar Imagem/Vídeo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { handleFilePicker(); closePickerModal(); }}>
                            <Text style={styles.modalOption}>Selecionar Documento</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closePickerModal}>
                            <Text style={styles.modalCancel}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </DefaultLayout>
    );
};

export default MessageChat;
