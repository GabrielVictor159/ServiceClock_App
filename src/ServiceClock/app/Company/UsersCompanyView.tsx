import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, TextInput, Image } from 'react-native';
import DefaultLayout from '../../components/DefaultLayout';
import { useFocusEffect } from '@react-navigation/native';
import { ServiceFactory, ServiceType } from '../../services/ServiceFactory';
import { ClientService, CreateClientRequest, GetClientRequest } from '../../services/ClientService';
import { AuthenticationItem, useAuthentication } from '../../provider/AuthenticationProvider';
import { useTheme } from '../../provider/ThemeProvider';
import { createUsersCompanyViewStyle } from '../../styles/App/Company/UsersCompanyViewStyle';
import UserImage from '../../components/UserImage';
import { useTranslation } from 'react-i18next';
import { formatUTCToLocale } from '../../utils/Dates';
import { useKeyboard } from '../../provider/KeyboardProvider';
import ClientForm from '../../components/ClientForm';
import Toast from 'react-native-toast-message';
import { useLoading } from '../../provider/IsLoadingProvider';
import LoadingScreen from '../../components/LoadingScreen';

const UsersCompanyView: React.FC = () => {
    const { isKeyboardHidden } = useKeyboard();
    const { authenticationItem } = useAuthentication();
    const { t, i18n } = useTranslation();
    const [clients, setClients] = useState<any[]>([]);
    const { theme } = useTheme();
    const [page, setPage] = useState<number>(1);
    const [isLoadinging, setIsLoadinging] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>();
    const [viewClient, setViewClient] = useState<any>();
    const [hasMoreClients, setHasMoreClients] = useState<boolean>(true);
    const [search, setSearch] = useState<boolean>(false);
    const [nameFilter, setNameFilter] = useState<string>("");
    const [newClientVisible, setNewClientVisible] = useState<boolean>(false);

    const clientService = ServiceFactory.createService(ServiceType.Client) as ClientService;
    const styles = createUsersCompanyViewStyle(theme, isKeyboardHidden);
    const { setIsLoading } = useLoading();

    useFocusEffect(
        useCallback(() => {
            getClients();
        }, [page])
    );

    const getClients = async () => {
        if (authenticationItem && !isLoadinging && hasMoreClients) {
            setIsLoadinging(true);
            const request = new GetClientRequest();
            request.indexPage = page;
            request.name = nameFilter;
            const [data, IsSucess] = await clientService.GetClient(request, authenticationItem);
            if (IsSucess) {
                if (data.clients.length === 0) {
                    setHasMoreClients(false);
                } else {
                    if (search) {
                        setClients(data.clients);
                        setSearch(false);
                    }
                    else {
                        const existingClientIds = new Set(clients.map(client => client.id));
                        const newClients = data.clients.filter((client: any) => !existingClientIds.has(client.id));
                        setClients(prevClients => [...(prevClients), ...newClients]);
                    }
                }
            }
            setIsLoadinging(false);
        }
    };

    const onDelete = async () => {
        if (deleteId && authenticationItem) {
            const [data, IsSucess] = await clientService.DeleteClient(deleteId, authenticationItem,setIsLoading);
            if (IsSucess) {
                setClients((prevClients) => prevClients.filter(client => client.id !== deleteId));
            }
            setDeleteId(undefined);
        }
    };

    const onSaveNewClient = async (clientData: CreateClientRequest) => {
        if (authenticationItem) {
            const [data, IsSucess] = await clientService.CreateClient(clientData, authenticationItem,setIsLoading);
            if (IsSucess) {
                setSearch(true);
                setHasMoreClients(true);
                setPage(1);
                await getClients();
                setNewClientVisible(false);
            }
        }
    };

    const handleScroll = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

        if (isAtBottom && !isLoadinging && hasMoreClients) {
            setPage(prevPage => prevPage + 1);
            getClients();
        }
    };

    const handleSearch = async () => {
        setSearch(true);
        setHasMoreClients(true);
        setPage(1);
        await getClients();
    };
    return (
        <>
            <DefaultLayout containerStyle={styles.defaultLayout}>
                <Image
                    style={styles.icon}
                    source={require("../../assets/management.png")}
                />
                <View style={styles.boxInput}>
                    <TextInput
                        placeholder={t("SearchByName")}
                        value={nameFilter}
                        style={styles.input}
                        onChangeText={(event: string) => {
                            setNameFilter(event);
                        }}
                    />
                    <TouchableOpacity onPress={() => { handleSearch() }} style={styles.button}>
                        <Text style={styles.textButton}>{t("Search")}</Text>
                    </TouchableOpacity>
                </View>
                <Text>{"\n"}</Text>
                <View style={styles.boxClients}>
                    <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
                        {clients && clients.map((client, index) => (
                            <View key={`client ${index}`} style={{ marginTop: 10 }}>
                                <View style={styles.lineInformation}>
                                    <UserImage width={50} height={50} source={client.image} />
                                    <View style={styles.columnInformation}>
                                        <View style={styles.lineText}>
                                            <Text style={styles.TextHighlight}>{`${t("UserEdit.nameLabel")}: `}</Text>
                                            <Text style={styles.NormalText}>{`${client.name}`}</Text>
                                        </View>
                                        <View style={styles.lineText}>
                                            <Text style={styles.TextHighlight}>{`${t("UserEdit.labelEmail")}: `}</Text>
                                            <Text style={styles.NormalText}>{`${client.email}`}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.lineButton}>
                                    <TouchableOpacity onPress={() => setViewClient(client)} style={styles.button}>
                                        <Text style={styles.textButton}>{t("View")}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setDeleteId(client.id)} style={{ ...styles.button, backgroundColor: '#e65c53' }}>
                                        <Text style={styles.textButton}>{t("Delete")}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                    <View style={{ ...styles.lineButton, borderBottomWidth: 0 }}>
                        <TouchableOpacity onPress={() => setNewClientVisible(true)} style={[styles.button, styles.buttonNewClient]}>
                            <Text style={styles.textButton}>{t("NewClient")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal visible={deleteId !== undefined} animationType="slide" transparent={true} style={{position:'absolute',zIndex:1}}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text>{t("ConfirmDelete")}</Text>
                            <View style={{ ...styles.lineButton, borderBottomWidth: 0 }}>
                                <TouchableOpacity onPress={onDelete} style={styles.button}>
                                    <Text style={styles.textButton}>{t("Service.Confirm")}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setDeleteId(undefined)} style={{ ...styles.button, backgroundColor: '#e65c53' }}>
                                    <Text style={styles.textButton}>{t("Service.Cancel")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal visible={viewClient !== undefined} animationType="slide" transparent={true} style={{zIndex:1}}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {viewClient && (
                                <>
                                    <View style={styles.lineText}>
                                        <Text style={styles.TextHighlight}>{`${t("UserEdit.nameLabel")}: `}</Text>
                                        <Text style={styles.NormalText}>{viewClient.name}</Text>
                                    </View>
                                    <View style={styles.lineText}>
                                        <Text style={styles.TextHighlight}>{`${t("UserEdit.labelEmail")}: `}</Text>
                                        <Text style={styles.NormalText}>{viewClient.email}</Text>
                                    </View>
                                    <View style={styles.lineText}>
                                        <Text style={styles.TextHighlight}>{`${t("UserEdit.phoneNumberLabel")}: `}</Text>
                                        <Text style={styles.NormalText}>{viewClient.phoneNumber}</Text>
                                    </View>
                                    <View style={styles.lineText}>
                                        <Text style={styles.TextHighlight}>{`${t("UserEdit.addressLabel")}: `}</Text>
                                        <Text style={styles.NormalText}>{viewClient.address}</Text>
                                    </View>
                                    <View style={styles.lineText}>
                                        <Text style={styles.TextHighlight}>{`${t("UserEdit.cityLabel")}: `}</Text>
                                        <Text style={styles.NormalText}>{viewClient.city}</Text>
                                    </View>
                                    <View style={styles.lineText}>
                                        <Text style={styles.TextHighlight}>{`${t("UserEdit.stateLabel")}: `}</Text>
                                        <Text style={styles.NormalText}>{viewClient.state}</Text>
                                    </View>
                                    <View style={styles.lineText}>
                                        <Text style={styles.TextHighlight}>{`${t("UserEdit.postalCodeLabel")}: `}</Text>
                                        <Text style={styles.NormalText}>{viewClient.postalCode}</Text>
                                    </View>
                                    <View style={styles.lineText}>
                                        <Text style={styles.TextHighlight}>{`${t("UserEdit.birthDate")}: `}</Text>
                                        <Text style={styles.NormalText}>{formatUTCToLocale(viewClient.birthDate, i18n.language).split(",")[0]}</Text>
                                    </View>
                                    <View style={{ ...styles.lineButton, borderBottomWidth: 0 }}>
                                        <TouchableOpacity onPress={() => setViewClient(undefined)} style={styles.button}>
                                            <Text style={styles.textButton}>{t("Close")}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
                <Modal  visible={newClientVisible} animationType="slide" transparent={true} style={{zIndex:1}}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <ClientForm
                                onSave={onSaveNewClient}
                                onCancel={() => setNewClientVisible(false)}
                            />

                        </View>
                    </View>
                </Modal>
            </DefaultLayout>
            <Toast />
        </>
    );
};

export default UsersCompanyView;
