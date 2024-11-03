import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Button } from 'react-native';
import DefaultLayout from '../../components/DefaultLayout';
import { useTranslation } from 'react-i18next';
import { ServiceFactory, ServiceType } from '../../services/ServiceFactory';
import { CompanyService, PatchCompanyRequest } from '../../services/CompanyService';
import { AuthenticationItem, useAuthentication } from '../../provider/AuthenticationProvider';
import { useTheme } from '../../provider/ThemeProvider';
import { createUserCompanyStyle } from '../../styles/App/Company/UserCompanyStyle';
import EditProperty from '../../components/EditProperty';
import Toast from 'react-native-toast-message';
import UserImage from '../../components/UserImage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { TextInputMask } from 'react-native-masked-text';
import { City, Country, OtherServices, State } from '../../services/OtherServices';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePage } from '../../provider/PageProvider';
import { ClientService, PatchClientRequest } from '../../services/ClientService';
import { formatUTCToLocale } from '../../utils/Dates';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLoading } from '../../provider/IsLoadingProvider';

const UserClient: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [user, setUser] = useState<any>();
    const { authenticationItem, setAuthenticationItem } = useAuthentication();
    const { theme } = useTheme();

    const styles = createUserCompanyStyle(theme);
    const ClientService = ServiceFactory.createService(ServiceType.Client) as ClientService;

    const [modalVisible, setModalVisible] = useState(false);
    const [currentField, setCurrentField] = useState('');
    const [currentValue, setCurrentValue] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newImageName, setNewImageName] = useState<string | undefined | null>();
    const [newImageUri, setNewImageUri] = useState<string | undefined>();
    const [newBirthDate, setNewBirthDate] = useState<Date>();
    const [showDateTimePicker, setShowDateTimePicker] = useState<boolean>(false);

    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    const [city, setCity] = useState<City | undefined>(undefined);
    const [state, setState] = useState<State | undefined>(undefined);
    const [country, setCountry] = useState<Country | undefined>(undefined);
    const { page, setPage } = usePage();
    const { setIsLoading } = useLoading();

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        if (authenticationItem) {
            let [data, isSucess] = await ClientService.GetClientById(authenticationItem.UserId, authenticationItem,setIsLoading);
            if (isSucess) {
                setUser(data.client);
            }
        }
    };

    const otherService = ServiceFactory.createService(ServiceType.Other) as OtherServices;
    useEffect(() => {
        if (user) {
            const selectedCountry = countries.find((c) => c.name === user.country);
            if (selectedCountry) setCountry(selectedCountry);
        }
    }, [countries]);

    useEffect(() => {
        const fetchCountries = async () => {
            const [data, isSuccess] = await otherService.GetCountrys();
            if (isSuccess) {
                const formattedCountries: Country[] = data.map((c: any) => ({
                    code: c.countryCode,
                    name: c.countryName,
                    geonameId: c.geonameId,
                }));
                setCountries(formattedCountries);
            }
        };
        fetchCountries();
    }, []);


    useEffect(() => {
        if (country) {
            const fetchStates = async () => {
                const [data, isSuccess] = await otherService.GetChildren(country.geonameId);
                if (isSuccess) {
                    const formattedStates: State[] = data.map((s: any) => ({
                        code: s.toponymCode,
                        name: s.toponymName,
                        geonameId: s.geonameId,
                    }));
                    setStates(formattedStates);
                    if (user && user.state) {
                        const selectedState = formattedStates.find((s) => s.name === user.state);
                        if (selectedState) setState(selectedState);
                    }
                }
            };
            fetchStates();
        }
    }, [country]);

    useEffect(() => {
        if (state) {
            const fetchCities = async () => {
                const [data, isSuccess] = await otherService.GetChildren(state.geonameId);
                if (isSuccess) {
                    const formattedCities: City[] = data.map((c: any) => ({
                        code: c.toponymCode,
                        name: c.toponymName,
                    }));
                    setCities(formattedCities);
                    if (user && user.city) {
                        const selectedCity = formattedCities.find((c) => c.name === user.city);
                        if (selectedCity) setCity(selectedCity);
                    }
                }
            };
            fetchCities();
        }
    }, [state]);

    const handleEdit = (field: string, value: string) => {
        setCurrentField(field);
        setCurrentValue(value);
        setModalVisible(true);

        if (field === 'password') {
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    const handleSave = async () => {
        if (authenticationItem) {
            let request = new PatchClientRequest();

            if (currentField === 'password') {
                if (newPassword !== confirmPassword) {
                    Toast.show({
                        text1: 'Erro',
                        text2: t('UserEdit.passwordNotCombine'),
                        type: 'error',
                    });
                    return;
                }
                else {
                    (request as any)[currentField] = currentValue;
                    const [data, isSuccess] = await ClientService.UpdateClient(request, authenticationItem,setIsLoading);
                    if (isSuccess) {
                        setUser((prevUser: any) => ({ ...prevUser, [currentField]: currentValue }));
                    }
                }
            } else if (currentField === 'image') {
                if (!newImageUri || !newImageName) {
                    Toast.show({
                        text1: 'Erro',
                        text2: t('UserEdit.unableGetImage'),
                        type: 'error',
                    });
                } else {
                    try {
                        const base64Image = await FileSystem.readAsStringAsync(newImageUri, {
                            encoding: FileSystem.EncodingType.Base64,
                        });
                        request.image = base64Image;
                        request.imageName = newImageName;

                        const [data, isSuccess] = await ClientService.UpdateClient(request, authenticationItem,setIsLoading);
                        if (isSuccess) {
                            setUser((prevUser: any) => ({ ...prevUser, image: data.client.image }));
                        }
                    } catch (error) {
                        Toast.show({
                            text1: 'Erro',
                            text2: t('UserEdit.errorProcessImage'),
                            type: 'error',
                        });
                    }
                }
            } 
            else if(currentField === 'birthDate'){
                request.birthDate = newBirthDate;
                const [data, isSuccess] = await ClientService.UpdateClient(request, authenticationItem,setIsLoading);
                    if (isSuccess) {
                        setUser((prevUser: any) => ({ ...prevUser, [currentField]: newBirthDate }));
                    }
            }
            else {
                (request as any)[currentField] = currentValue;
                const [data, isSuccess] = await ClientService.UpdateClient(request, authenticationItem,setIsLoading);
                if (isSuccess) {
                    setUser((prevUser: any) => ({ ...prevUser, [currentField]: currentValue }));
                }
            }

            setModalVisible(false);
        }
    };

    const handleImageSelection = async (): Promise<void> => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert(t('UserEdit.notPermissionImage'));
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setNewImageUri(result.assets[0].uri);
            setNewImageName(result.assets[0].fileName);
        }
    };

    const logout = () => {
        AsyncStorage.removeItem('authenticationItem');
        setPage(0);
    }

    return (
        <>
            <DefaultLayout>
                <View style={styles.boxImage}>
                    <UserImage
                        width={100}
                        height={100}
                        styleBox={{ borderWidth: 3, elevation: 5 }}
                        source={user?.image || null}
                    />
                    <TouchableOpacity onPress={() => handleEdit('image', user?.image)}>
                        <Image style={styles.ImgEditLine} source={require("../../assets/edit.png")} />
                    </TouchableOpacity>
                </View>
                <Text>{"\n"}</Text>
                <View style={styles.boxProperties}>
                    {user && (
                        <>
                            <View style={styles.LineText}>
                                <Text style={styles.TextHighlight}>{`${t("UserEdit.nameLabel")}: `}</Text>
                                <Text style={styles.NormalText}>{`${user.name}`}</Text>
                                <TouchableOpacity onPress={() => handleEdit('name', user.name)}>
                                    <Image style={styles.ImgEditLine} source={require("../../assets/edit.png")} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.LineText}>
                                <Text style={styles.TextHighlight}>{`${t("UserEdit.passwordLabel")}: `}</Text>
                                <Text style={styles.NormalText}>{`*******`}</Text>
                                <TouchableOpacity onPress={() => handleEdit('password', '*******')}>
                                    <Image style={styles.ImgEditLine} source={require("../../assets/edit.png")} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.LineText}>
                                <Text style={styles.TextHighlight}>{`${t("UserEdit.addressLabel")}: `}</Text>
                                <Text style={styles.NormalText}>{`${user.address}`}</Text>
                                <TouchableOpacity onPress={() => handleEdit('address', user.address)}>
                                    <Image style={styles.ImgEditLine} source={require("../../assets/edit.png")} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.LineText}>
                                <Text style={styles.TextHighlight}>{`${t("UserEdit.cityLabel")}: `}</Text>
                                <Text style={styles.NormalText}>{`${user.city}`}</Text>
                                <TouchableOpacity onPress={() => handleEdit('city', user.city)}>
                                    <Image style={styles.ImgEditLine} source={require("../../assets/edit.png")} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.LineText}>
                                <Text style={styles.TextHighlight}>{`${t("UserEdit.stateLabel")}: `}</Text>
                                <Text style={styles.NormalText}>{`${user.state}`}</Text>
                                <TouchableOpacity onPress={() => handleEdit('state', user.state)}>
                                    <Image style={styles.ImgEditLine} source={require("../../assets/edit.png")} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.LineText}>
                                <Text style={styles.TextHighlight}>{`${t("UserEdit.postalCodeLabel")}: `}</Text>
                                <Text style={styles.NormalText}>{`${user.postalCode}`}</Text>
                                <TouchableOpacity onPress={() => handleEdit('postalCode', user.postalCode)}>
                                    <Image style={styles.ImgEditLine} source={require("../../assets/edit.png")} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.LineText}>
                                <Text style={styles.TextHighlight}>{`${t("UserEdit.phoneNumberLabel")}: `}</Text>
                                <Text style={styles.NormalText}>{`${user.phoneNumber}`}</Text>
                                <TouchableOpacity onPress={() => handleEdit('phoneNumber', user.phoneNumber)}>
                                    <Image style={styles.ImgEditLine} source={require("../../assets/edit.png")} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.LineText}>
                                <Text style={styles.TextHighlight}>{`${t("UserEdit.birthDate")}: `}</Text>
                                <Text style={styles.NormalText}>{`${formatUTCToLocale(user.birthDate, i18n.language).split(',')[0]}`}</Text>
                                <TouchableOpacity onPress={() => handleEdit('birthDate', user.birthDate)}>
                                    <Image style={styles.ImgEditLine} source={require("../../assets/edit.png")} />
                                </TouchableOpacity>
                            </View>
                            <EditProperty
                                visible={modalVisible}
                                setVisible={setModalVisible}
                                onSave={handleSave}
                            >
                                {(() => {
                                    switch (currentField) {
                                        case 'password':
                                            return (
                                                <>
                                                    <TextInput
                                                        value={newPassword}
                                                        onChangeText={setNewPassword}
                                                        placeholder={t("UserEdit.placeholderPassword")}
                                                        secureTextEntry
                                                        style={{ borderWidth: 1, padding: 8, borderColor: 'gray', borderRadius: 5 }}
                                                    />
                                                    <TextInput
                                                        value={confirmPassword}
                                                        onChangeText={setConfirmPassword}
                                                        placeholder={t("UserEdit.placeholderConfirmPassword")}
                                                        secureTextEntry
                                                        style={{ borderWidth: 1, padding: 8, borderColor: 'gray', borderRadius: 5, marginTop: 10 }}
                                                    />
                                                </>
                                            );

                                        case 'image':
                                            return (
                                                <>
                                                    <View style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                                        <TouchableOpacity onPress={handleImageSelection} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                            <Text>{t("UserEdit.pickImage")}</Text>
                                                            <Image style={{ width: 50, height: 50, objectFit: 'cover', tintColor: theme.themeColor, borderWidth: 2 }} source={require("../../assets/pick_image.png")} />
                                                        </TouchableOpacity>
                                                        {newImageUri ? (
                                                            <Image source={{ uri: newImageUri }} style={{ width: 100, height: 100, borderWidth: 2, borderColor: 'black', marginTop: 30 }} />
                                                        ) : null}
                                                    </View>
                                                </>
                                            );
                                        case 'registrationNumber':
                                            return (
                                                <>
                                                    <TextInputMask
                                                        type={'cnpj'}
                                                        style={{ borderWidth: 1, padding: 8, borderColor: 'gray', borderRadius: 5 }}
                                                        value={currentValue}
                                                        placeholder={t("UserEdit.placeholderCNPJ")}
                                                        onChangeText={setCurrentValue} />
                                                </>
                                            );
                                        case 'postalCode':
                                            return (
                                                <>
                                                    <TextInputMask
                                                        type={'zip-code'}
                                                        style={{ borderWidth: 1, padding: 8, borderColor: 'gray', borderRadius: 5 }}
                                                        value={currentValue}
                                                        placeholder={t("Service.PostalCode")}
                                                        onChangeText={setCurrentValue} />
                                                </>
                                            );
                                        case 'birthDate':
                                            return (
                                                <>
                                                <Text style={{width:'100%',textAlign:'center', marginBottom:20,...styles.NormalText}}>
                                                    {newBirthDate==undefined
                                                    ? `${formatUTCToLocale(user.birthDate, i18n.language).split(',')[0]}` 
                                                    : `${formatUTCToLocale(newBirthDate.toString(), i18n.language).split(',')[0]}` }
                                                </Text>
                                                <Button title={t('UserEdit.selectDateLabel')} onPress={() => setShowDateTimePicker(true)} />
                                                {showDateTimePicker && (
                                                    <DateTimePicker
                                                    value={newBirthDate==undefined?new Date():newBirthDate}
                                                    mode="date"
                                                    display="default"
                                                    maximumDate={new Date()}
                                                    onChange={(event, selectedDate) => {
                                                        const currentDate = selectedDate || newBirthDate;
                                                        setNewBirthDate(currentDate);
                                                        setShowDateTimePicker(false);
                                                    }}/>
                                                )}
                                                    
                                                </>
                                            );
                                        case 'state':
                                            return (
                                                <>
                                                    {
                                                        states.length > 0 ?
                                                            <>
                                                                <View style={styles.selectBox}>
                                                                    <Picker selectedValue={state} onValueChange={(value) => { setState(value); setCurrentValue(value.name); }} style={styles.select}>
                                                                        <Picker.Item label={t("Service.SelectState")} value={undefined} style={styles.pickerLabel} />
                                                                        {states.map((s) => (
                                                                            <Picker.Item key={`state ${s.geonameId}`} label={s.name} value={s} />
                                                                        ))}
                                                                    </Picker>
                                                                </View>
                                                            </>
                                                            :
                                                            <>
                                                                <TextInput
                                                                    value={currentValue}
                                                                    onChangeText={setCurrentValue}
                                                                    placeholder={t("UserEdit.placeholderNewValue")}
                                                                    style={{ borderWidth: 1, padding: 8, borderColor: 'gray', borderRadius: 5 }}
                                                                />
                                                            </>
                                                    }
                                                </>
                                            );
                                        case 'city':
                                            return (
                                                <>
                                                    {
                                                        cities.length > 0 ?
                                                            <>
                                                                <View style={styles.selectBox}>
                                                                    <Picker selectedValue={city} onValueChange={(value) => { setCity(value); setCurrentValue(value.name); }} style={styles.select}>
                                                                        <Picker.Item label={t("Service.SelectCity")} value={undefined} style={styles.pickerLabel} />
                                                                        {cities.map((s) => (
                                                                            <Picker.Item key={`city ${s.code}`} label={s.name} value={s} />
                                                                        ))}
                                                                    </Picker>
                                                                </View>
                                                            </>
                                                            :
                                                            <>
                                                                <TextInput
                                                                    value={currentValue}
                                                                    onChangeText={setCurrentValue}
                                                                    placeholder={t("UserEdit.placeholderNewValue")}
                                                                    style={{ borderWidth: 1, padding: 8, borderColor: 'gray', borderRadius: 5 }}
                                                                />
                                                            </>
                                                    }
                                                </>
                                            );
                                        case 'phoneNumber':
                                            return (
                                                <>
                                                    <TextInputMask
                                                        type={'cel-phone'}
                                                        style={{ borderWidth: 1, padding: 8, borderColor: 'gray', borderRadius: 5 }}
                                                        value={currentValue}
                                                        placeholder={t("UserEdit.placeholderNewValue")}
                                                        onChangeText={setCurrentValue} />
                                                </>
                                            );
                                        default:
                                            return (
                                                <TextInput
                                                    value={currentValue}
                                                    onChangeText={setCurrentValue}
                                                    placeholder={t("UserEdit.placeholderNewValue")}
                                                    style={{ borderWidth: 1, padding: 8, borderColor: 'gray', borderRadius: 5 }}
                                                />
                                            );
                                    }
                                })()}
                            </EditProperty>

                        </>
                    )}
                </View>
                <Text>{"\n"}</Text>
                <TouchableOpacity style={styles.logoutView} onPress={() => { logout() }}>
                    <Image style={styles.logoutIcon} source={require("../../assets/log-out.png")} />
                    <Text style={styles.textLogout}>{t("Sair")}</Text>
                </TouchableOpacity>
                <Toast />
            </DefaultLayout>
        </>
    );
};

export default UserClient;
