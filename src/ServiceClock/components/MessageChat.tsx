import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Modal, StyleSheet, Button, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
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
import { CreateMessageRequest, ListMessageRequest, MessageService, MessageType } from '../services/MessageService';
import VideoPlayer from 'expo-video-player'
import { Audio, ResizeMode, Video } from 'expo-av';
import AudioPlayer from './AudioPlayer';
import mimeDb from 'mime-db';
import Toast from 'react-native-toast-message';
import VideoPlayerWithControls from './VideoPlayerWithControls';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ServiceFactory, ServiceType } from '../services/ServiceFactory';
import { AuthenticationItem, useAuthentication } from '../provider/AuthenticationProvider';
import { convertUriToBase64, handleDownload } from '../utils/Files';
import { Environment } from '../Environment';
import { WebSocketBody } from '../services/WebSocket';
import FullScreenImage from './FullScreenImage';

interface MessageChatProps {
    otherUser: any;
    otherUserType: 'Company' | 'Client';
    onBack?: () => void;
}

const MessageChat: React.FC<MessageChatProps> = ({ otherUser, otherUserType, onBack }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { isKeyboardHidden } = useKeyboard();
    const { isEspecialButtonsVisible, setIsEspecialButtonsVisible } = useEspecialButtons();
    const { authenticationItem } = useAuthentication();
    const styles = createMessageChatStyle(theme, isKeyboardHidden);

    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [selectedFileType, setSelectedFileType] = useState<MessageType | null>();

    const [isFirstRequest, setIsFirstRequest] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState(false);

    const ws = useRef<WebSocket | null>(null);
    const scrollViewRef = useRef<ScrollView>(null);


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
            }
        }
        catch { }
    };

    const showPickerModal = () => {
        setModalVisible(true);
    };

    const closePickerModal = () => {
        setModalVisible(false);
    };

    const renderDownloadButton = (file: any) => (
        <TouchableOpacity onPress={() => handleDownload(file)}>
            <Image
                style={{ width: 20, height: 20, objectFit: 'contain', tintColor: theme.themeColor }}
                source={require("../assets/download.png")}
            />
        </TouchableOpacity>
    );

    const renderFileContent = (file: any, fileType: MessageType, message: boolean) => {
        switch (fileType) {
            case MessageType.Img:
                return (
                    <FullScreenImage
                        uri={file.uri}
                        style={{ width: 200, height: message ? 200 : 100, resizeMode: 'cover' }}
                    />
                );
            case MessageType.Video:
                return (
                    <VideoPlayerWithControls
                        width={200}
                        height={100}
                        timeText={false}
                        videoUri={file.uri}
                    />
                );
            case MessageType.Audio:
                return (
                    <>
                        {
                            message ?
                                <AudioPlayer
                                    sliderContainerStyle={{ width: 130 }}
                                    audioUri={file.uri}
                                />
                                :
                                <AudioPlayer
                                    audioUri={file.uri}
                                />
                        }
                    </>
                );
            case MessageType.File:
                return (
                    <View style={styles.filePreview}>
                        <View style={styles.fileIcon}>
                            <Image
                                style={styles.fileIconImage}
                                source={require("../assets/google-docs.png")}
                            />
                        </View>
                        {file.name && <Text style={styles.fileName}>{file.name}</Text>}
                    </View>
                );
            default:
                return null;
        }
    };

    const renderFilePreview = (
        file: any,
        fileType: MessageType,
        download: boolean = false,
        message: boolean = false,
        otherUser: boolean = false
    ) => {
        if (!file || !file.uri) return null;

        const fileContent = renderFileContent(file, fileType, message);

        return (
            <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                {otherUser ? (
                    <>
                        {fileContent}
                        {download && renderDownloadButton(file)}
                    </>
                ) : (
                    <>
                        {fileContent}
                    </>
                )}
            </View>
        );
    };


    const renderMessages = () => {
        return messages.map((mes, index) => {
            return (
                <View key={`messages-${mes.Id}-${index}`} style={[mes.CreatedBy == authenticationItem?.UserId ? styles.lineActualUser : styles.lineOtherUser, styles.line]}>
                    {
                        mes.Type === MessageType.Txt
                            ?
                            <View style={[styles.messageBox, { backgroundColor: authenticationItem?.UserId==mes.CreatedBy ? '#a9dbac' : 'white' }]}>
                                <Text>{mes.MessageContent}</Text>
                            </View>
                            :
                            <View style={[styles.messageBox, { backgroundColor: authenticationItem?.UserId==mes.CreatedBy ? '#a9dbac' : 'white' }]}>
                                {renderFilePreview({ uri: new Environment().imageContainer + mes.MessageContent }, mes.Type, true, true, mes.CreatedBy == authenticationItem?.UserId ? false : true)}
                            </View>
                    }
                </View>
            );
        })
    }


    const messageService = ServiceFactory.createService(ServiceType.Message) as MessageService;

    const sendMessage = async () => {
        if (authenticationItem) {
            if (selectedFile && selectedFileType) {
                let content = await convertUriToBase64(selectedFile.uri);
                if (content) {
                    let request = new CreateMessageRequest(selectedFileType, otherUserType === 'Company' ? authenticationItem.UserId : otherUser.id,
                        otherUserType === 'Client' ? authenticationItem.UserId : otherUser.id, content, selectedFile.name);


                    const [data, isSucess] = await messageService.CreateMessage(request, authenticationItem);

                    if (isSucess) {
                        setSelectedFile(null);
                        setSelectedFileType(null);
                    }
                }
            }
            if (message !== "") {
                let request = new CreateMessageRequest(MessageType.Txt, otherUserType === 'Company' ? authenticationItem.UserId : otherUser.id,
                    otherUserType === 'Client' ? authenticationItem.UserId : otherUser.id, message);

                const [data, isSucess] = await messageService.CreateMessage(request, authenticationItem);

                if (isSucess) {
                    setMessage("");
                }
            }
        }

    }

    useEffect(() => {
        ws.current = new WebSocket(new Environment().webSocket);

        ws.current.onopen = () => {
            sendWebSocketRequest();
        };

        ws.current.onmessage = (event) => {
            try {

                let dataParse;
                try {
                    dataParse = JSON.parse(event.data);
                } catch (e) {

                    dataParse = event.data;
                }

                if (Array.isArray(dataParse)) {
                    const sortedMessages = dataParse.sort((a, b) => {
                        const dateA = new Date(a.CreateAt);
                        const dateB = new Date(b.CreateAt);
                        return dateA.getTime() - dateB.getTime();
                    });

                    setMessages((prevMessages) => {
                        const uniqueMessages = sortedMessages.filter((newMessage) => {
                            return !prevMessages.some((existingMessage) => existingMessage.Id === newMessage.Id);
                        });
                        return [...prevMessages, ...uniqueMessages];
                    });
                }


                else if (typeof dataParse === 'string') {
                    Toast.show({
                        type: 'error',
                        text1: 'Erro',
                        text2: dataParse,
                    });
                }

                else {
                    Toast.show({
                        type: 'error',
                        text1: 'Erro',
                        text2: t("MessageNotSuport"),
                    });
                }
            } catch (error) {

                console.error('Erro inesperado:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Erro',
                    text2: 'Dados recebidos inválidos.',
                });
            }
        };

        return () => {
            ws.current?.close();
        };

    }, []);

    useEffect(() => {
        if (isFirstRequest && messages.length > 0) {
            scrollToEnd();
            setIsFirstRequest(false);
        }
    }, [messages])

    const sendWebSocketRequest = () => {
        if (ws.current != null && ws.current.readyState === WebSocket.OPEN && authenticationItem) {
            const lastMessageDate = messages.reduce((newestMessage, currentMessage) => {
                if (!newestMessage || new Date(currentMessage.CreateAt) > new Date(newestMessage.CreateAt)) {
                    return currentMessage;
                }
                return newestMessage;
            }, null);


            const lastMessageDateTime = lastMessageDate ? lastMessageDate.CreateAt : null;
            let request = new ListMessageRequest(
                otherUserType === 'Company' ? authenticationItem.UserId : otherUser.id,
                otherUserType === 'Client' ? authenticationItem.UserId : otherUser.id,
                lastMessageDateTime
            );

            let requestWebSocket = new WebSocketBody("ListMessage", `Bearer ${authenticationItem.Token}`, request);

            ws.current.send(JSON.stringify(requestWebSocket));
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            sendWebSocketRequest();
        }, 1000);

        return () => clearInterval(intervalId);
    }, [ws, messages, authenticationItem, otherUserType, otherUser]);


    const scrollToEnd = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const [isAtBottom, setIsAtBottom] = useState<boolean>(true);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetY = event.nativeEvent.contentOffset.y; 
        const contentHeight = event.nativeEvent.contentSize.height;
        const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    
        if (contentHeight - contentOffsetY <= layoutHeight + 1) {
          setIsAtBottom(true); 
        } else if (contentHeight - contentOffsetY > layoutHeight + 50) {
          setIsAtBottom(false); 
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
                <ScrollView ref={scrollViewRef}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}>
                    {renderMessages()}
                    <Text>{"\n"}</Text>
                </ScrollView>
                { !isAtBottom &&
                    <View style={{width:'100%', display:'flex', flexDirection:'row', justifyContent:'flex-end', position:'absolute', top:'90%'}}>
                    <TouchableOpacity onPress={()=>{scrollToEnd()}}>
                        <View style={{ width: 40, height: 40, backgroundColor: 'white',  borderRadius: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                            <Image style={{ width: 20, height: 20, objectFit: 'contain', tintColor: theme.themeColor }} source={require("../assets/arrow_down.png")} />
                        </View>
                    </TouchableOpacity>
                    </View>
                }
            </View>
            <View style={styles.footer}>
                <View style={{ ...styles.inputViewColumn }}>
                    {selectedFile && (
                        <View style={styles.selectedFileView}>
                            <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <TouchableOpacity onPress={() => { setSelectedFileType(null); setSelectedFile(null); }}>
                                    <Image style={{ width: 15, height: 15, objectFit: 'contain', tintColor: theme.themeColor }} source={require("../assets/close.png")} />
                                </TouchableOpacity>
                            </View>
                            {selectedFileType && renderFilePreview(selectedFile, selectedFileType, false, false)}
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

                <TouchableOpacity onPress={() => { sendMessage(); }}>
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
