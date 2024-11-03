import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CreateClientRequest } from '../services/ClientService';
import { Theme, useTheme } from '../provider/ThemeProvider';
import { useKeyboard } from '../provider/KeyboardProvider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInputMask } from 'react-native-masked-text';
import { City, Country, OtherServices, State } from '../services/OtherServices';
import { ServiceFactory, ServiceType } from '../services/ServiceFactory';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { ddiOptions } from '../utils/ddiOptions';
import SelectDropdownModal from './SelectDropdownModal';

interface ClientFormProps {
    onSave: (clientData: CreateClientRequest) => void;
    onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSave, onCancel }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { isKeyboardHidden } = useKeyboard();
    const [clientData, setClientData] = useState<CreateClientRequest>(new CreateClientRequest());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [phone, setPhone] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [modalDDIVisible, setModalDDIVisible] = useState(false);
    const [ddi,setDdi] = useState<string>("");


    const styles = createClientFormStyle(theme, isKeyboardHidden);

    const handleInputChange = (field: keyof CreateClientRequest, value: string) => {
        setClientData((prevData) => ({
            ...prevData,
            [field]: field === 'birthDate' ? new Date(value) : value,
        }));
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || clientData.birthDate;
        setShowDatePicker(false);
        if (currentDate) {
            handleInputChange('birthDate', currentDate.toISOString().split('T')[0]);
        }
    };


    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    const otherService = ServiceFactory.createService(ServiceType.Other) as OtherServices;

    useEffect(() => {
        const fetchCountries = async () => {
            const [data, isSuccess] = await otherService.GetCountrys();
            if (isSuccess) {
                const formattedCountries = data.map((element: any) => ({
                    code: element.countryCode,
                    name: element.countryName,
                    geonameId: element.geonameId,
                }));
                setCountries(formattedCountries);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        if (clientData.country) {
            const fetchStates = async () => {
                const [data, isSuccess] = await otherService.GetChildren(countries.find((element) => element.name === clientData.country)?.geonameId || '');
                if (isSuccess) {
                    const formatted = data.map((element: any) => ({
                        code: element.toponymCode,
                        name: element.toponymName,
                        geonameId: element.geonameId,
                    }));
                    setStates(formatted);
                }
            };
            fetchStates();
        }
    }, [clientData.country]);

    useEffect(() => {
        if (clientData.state) {
            const fetchCities = async () => {
                const [data, isSuccess] = await otherService.GetChildren(states.find((element) => element.name === clientData.state)?.geonameId || '');
                if (isSuccess) {
                    const formatted = data.map((element: any) => ({
                        code: element.toponymCode,
                        name: element.toponymName,
                    }));
                    setCities(formatted);
                }
            };
            fetchCities();
        }
    }, [clientData.state]);

    const handleSave = () => {
        if (clientData.password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: "Error",
                text2: t("PasswordsNotMatch"),
            });
            return;
        }
        clientData.phoneNumber = ddi + " "+ phone;
        onSave(clientData);
    };

    const handleDDISelect = (item: string) => {
        let filter = ddiOptions.find(option=>option.label===item)?.value ?? "";
        setDdi(filter);
    };
    
    return (
        <>
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("UserEdit.nameLabel")}</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(value) => handleInputChange('name', value)}
                            placeholder={t("UserEdit.placeholderValue")}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("UserEdit.labelEmail")}</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(value) => handleInputChange('email', value)}
                            placeholder={t("UserEdit.placeholderValue")}
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("UserEdit.placeholderPassword2")}</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            onChangeText={(value) => handleInputChange('password', value)}
                            placeholder={t("UserEdit.placeholderPassword2")}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("UserEdit.placeholderConfirmPassword2")}</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            onChangeText={setConfirmPassword}
                            placeholder={t("UserEdit.placeholderConfirmPassword2")}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("UserEdit.phoneNumberLabel")}</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', width:'100%' }}>
                            <TouchableOpacity
                                style={styles.selectButton}
                                onPress={() => setModalDDIVisible(true)}
                            >
                                <Text>{ddi === '' ? '⌵' : ddi}</Text>
                            </TouchableOpacity>
                            <TextInputMask
                                type={'cel-phone'}
                                onChangeText={(value: any) => setPhone(value)}
                                style={styles.input}
                                placeholder={t("UserEdit.placeholderValue")}
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("UserEdit.addressLabel")}</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(value) => handleInputChange('address', value)}
                            placeholder={t("UserEdit.placeholderValue")}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("UserEdit.countryLabel")}</Text>
                        <Picker
                            selectedValue={clientData.country}
                            onValueChange={(itemValue: string) => handleInputChange('country', itemValue)}
                            style={styles.input}
                        >
                            <Picker.Item label={t('register.selectCountry')} value="" />
                            {countries.map((country) => (
                                <Picker.Item key={country.name} label={country.name} value={country.name} />
                            ))}
                        </Picker>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("UserEdit.stateLabel")}</Text>
                        <Picker
                            selectedValue={clientData.state}
                            onValueChange={(itemValue: string) => handleInputChange('state', itemValue)}
                            style={styles.input}
                        >
                            <Picker.Item label={t('register.selectState')} value="" />
                            {states.map((state) => (
                                <Picker.Item key={state.name} label={state.name} value={state.name} />
                            ))}
                        </Picker>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("UserEdit.cityLabel")}</Text>
                        <Picker
                            selectedValue={clientData.city}
                            onValueChange={(itemValue: string) => handleInputChange('city', itemValue)}
                            style={styles.input}
                        >
                            <Picker.Item label={t('register.selectCity')} value="" />
                            {cities.map((city) => (
                                <Picker.Item key={city.name} label={city.name} value={city.name} />
                            ))}
                        </Picker>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("UserEdit.postalCodeLabel")}</Text>
                        <TextInputMask
                            type={'zip-code'}
                            onChangeText={(value: any) => handleInputChange('postalCode', value)}
                            placeholder={t("UserEdit.placeholderValue")}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{t("UserEdit.birthDate")}</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                            <Text>{clientData.birthDate ? clientData.birthDate.toISOString().split('T')[0] : t("UserEdit.selectDateLabel")}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={clientData.birthDate || new Date()}
                                mode="date"
                                display="default"
                                maximumDate={new Date()}
                                onChange={handleDateChange}
                            />
                        )}
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => { handleSave() }} style={styles.saveButton}>
                        <Text style={styles.buttonText}>{t("Save")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                        <Text style={styles.buttonText}>{t("Cancel")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <SelectDropdownModal
                    visible={modalDDIVisible}
                    options={ddiOptions.map((option) => option.label)}
                    onSelect={handleDDISelect}
                    onClose={() => setModalDDIVisible(false)}
                />
            <Toast />
        </>
    );
};

const createClientFormStyle = (theme: Theme, isKeyboardHidden: boolean = true) => StyleSheet.create({
    container: {
        flexDirection: 'column',
        padding: 16,
        height: 400,
        width: '100%'
    },
    inputContainer: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        padding: 8,
        backgroundColor: '#ebebeb',
        flex:1
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginTop: 10
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#e65c53',
        padding: 12,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    selectButton: {
        width:40,
        height:40,
        backgroundColor: "#ebebeb",
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }
});

export default ClientForm;
