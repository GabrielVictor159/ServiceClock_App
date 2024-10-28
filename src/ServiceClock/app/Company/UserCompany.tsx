import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
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

const UserCompany: React.FC = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState<any>();
    const { authenticationItem } = useAuthentication();
    const { theme } = useTheme();

    const styles = createUserCompanyStyle(theme);
    const companyService = ServiceFactory.createService(ServiceType.Company) as CompanyService;

    const [modalVisible, setModalVisible] = useState(false);
    const [currentField, setCurrentField] = useState('');
    const [currentValue, setCurrentValue] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newImageName, setNewImageName] = useState<string | undefined | null>();
    const [newImageUri, setNewImageUri] = useState<string | undefined>();

    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    const [city, setCity] = useState<City | undefined>(undefined);
    const [state, setState] = useState<State | undefined>(undefined);
    const [country, setCountry] = useState<Country | undefined>(undefined);

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        if (authenticationItem) {
            let [data, isSucess] = await companyService.GetCompanyById(authenticationItem.UserId, authenticationItem);
            if (isSucess) {
                setUser(data.company);
            }
        }
    };

    const otherService = ServiceFactory.createService(ServiceType.Other) as OtherServices;
    useEffect(()=>{
        if (user) {
            const selectedCountry = countries.find((c) => c.name === user.country);
            if (selectedCountry) setCountry(selectedCountry);
        }
    },[countries]);

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
            let request = new PatchCompanyRequest();

            if (currentField === 'password') {
                if (newPassword !== confirmPassword) {
                    Toast.show({
                        text1: 'Erro',
                        text2: 'As senhas não correspondem.',
                        type: 'error',
                    });
                    return;
                }
                else {
                    (request as any)[currentField] = currentValue;
                    const [data, isSuccess] = await companyService.PatchCompany(request, authenticationItem);
                    if (isSuccess) {
                        setUser((prevUser: any) => ({ ...prevUser, [currentField]: currentValue }));
                    }
                }
            } else if (currentField === 'image') {
                if (!newImageUri || !newImageName) {
                    Toast.show({
                        text1: 'Erro',
                        text2: 'Não foi possível obter a imagem',
                        type: 'error',
                    });
                } else {
                    try {
                        const base64Image = await FileSystem.readAsStringAsync(newImageUri, {
                            encoding: FileSystem.EncodingType.Base64,
                        });
                        request.image = base64Image;
                        request.imageName = newImageName;

                        const [data, isSuccess] = await companyService.PatchCompany(request, authenticationItem);
                        if (isSuccess) {
                            setUser((prevUser: any) => ({ ...prevUser, image: data.company.image }));
                        }
                    } catch (error) {
                        console.error("Erro ao converter imagem para base64", error);
                        Toast.show({
                            text1: 'Erro',
                            text2: 'Falha ao processar a imagem.',
                            type: 'error',
                        });
                    }
                }
            } else {
                (request as any)[currentField] = currentValue;
                const [data, isSuccess] = await companyService.PatchCompany(request, authenticationItem);
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
            alert('Você precisa permitir o acesso à biblioteca de imagens!');
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
                                <Text style={styles.TextHighlight}>{`${t("UserEdit.registrationNumberLabel")}: `}</Text>
                                <Text style={styles.NormalText}>{`${user.registrationNumber}`}</Text>
                                <TouchableOpacity onPress={() => handleEdit('registrationNumber', user.registrationNumber)}>
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
                                                        placeholder="Digite a nova senha"
                                                        secureTextEntry
                                                        style={{ borderWidth: 1, padding: 8, borderColor: 'gray', borderRadius: 5 }}
                                                    />
                                                    <TextInput
                                                        value={confirmPassword}
                                                        onChangeText={setConfirmPassword}
                                                        placeholder="Confirme a nova senha"
                                                        secureTextEntry
                                                        style={{ borderWidth: 1, padding: 8, borderColor: 'gray', borderRadius: 5, marginTop: 10 }}
                                                    />
                                                </>
                                            );

                                        case 'image':
                                            return (
                                                <>
                                                    <TouchableOpacity onPress={handleImageSelection}>
                                                        <Text style={{ color: 'blue', marginBottom: 10 }}>Escolher Imagem</Text>
                                                    </TouchableOpacity>
                                                    {newImageUri ? (
                                                        <Image source={{ uri: newImageUri }} style={{ width: 100, height: 100 }} />
                                                    ) : null}
                                                </>
                                            );
                                        case 'registrationNumber':
                                            return (
                                                <>
                                                    <TextInputMask
                                                        type={'cnpj'}
                                                        style={{ borderWidth: 1, padding: 8, borderColor: 'gray', borderRadius: 5 }}
                                                        value={currentValue}
                                                        placeholder={"Digite o novo CNPJ"}
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
                                        case 'state':
                                            return (
                                                <>
                                                    {
                                                        states.length > 0 ?
                                                            <>
                                                                <View style={styles.selectBox}>
                                                                    <Picker selectedValue={state} onValueChange={(value) => {setState(value); setCurrentValue(value.name);}} style={styles.select}>
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
                                                                    placeholder={`Digite ${currentField}`}
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
                                                                    <Picker selectedValue={city} onValueChange={(value) => {setCity(value); setCurrentValue(value.name);}} style={styles.select}>
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
                                                                    placeholder={`Digite ${currentField}`}
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
                                                        placeholder={"Digite o novo telefone"}
                                                        onChangeText={setCurrentValue} />
                                                </>
                                            );
                                        default:
                                            return (
                                                <TextInput
                                                    value={currentValue}
                                                    onChangeText={setCurrentValue}
                                                    placeholder={`Digite ${currentField}`}
                                                    style={{ borderWidth: 1, padding: 8, borderColor: 'gray', borderRadius: 5 }}
                                                />
                                            );
                                    }
                                })()}
                            </EditProperty>

                        </>
                    )}
                </View>
                <Toast />
            </DefaultLayout>
        </>
    );
};

export default UserCompany;
