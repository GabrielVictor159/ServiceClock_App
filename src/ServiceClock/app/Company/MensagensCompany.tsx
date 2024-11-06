import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, TouchableHighlight } from 'react-native';
import DefaultLayout from '../../components/DefaultLayout';
import UserImage from '../../components/UserImage';
import { useFocusEffect } from '@react-navigation/native';
import { useKeyboard } from '../../provider/KeyboardProvider';
import { useAuthentication } from '../../provider/AuthenticationProvider';
import { useTranslation } from 'react-i18next';
import { ClientService, GetClientRequest } from '../../services/ClientService';
import { ServiceFactory, ServiceType } from '../../services/ServiceFactory';
import { createMensagensCompanyStyle } from '../../styles/App/Company/MensagensCompanyStyle';
import { useLoading } from '../../provider/IsLoadingProvider';
import { useTheme } from '../../provider/ThemeProvider';

const MensagensCompany: React.FC = () => {
    const { isKeyboardHidden } = useKeyboard();
    const { authenticationItem } = useAuthentication();
    const { t, i18n } = useTranslation();
    const { setIsLoading } = useLoading();
    const { theme } = useTheme();

    const [isLoadinging, setIsLoadinging] = useState<boolean>(false);
    const [hasMoreClients, setHasMoreClients] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<boolean>(false);
    const [nameFilter, setNameFilter] = useState<string>("");
    const [clients, setClients] = useState<any[]>([]);

    const styles = createMensagensCompanyStyle(theme, isKeyboardHidden);

    useFocusEffect(
        useCallback(() => {
            setClients([]);
            getClients();
        }, [])
    );

    const clientService = ServiceFactory.createService(ServiceType.Client) as ClientService;

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
            <DefaultLayout>
                <Image
                    style={styles.icon}
                    source={require("../../assets/comments.png")}
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
                            <View key={`client ${index}`} style={{ marginTop: index > 0 ? 20 : 0 }}>
                                <TouchableOpacity>
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
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </DefaultLayout>
        </>
    );
};

export default MensagensCompany;