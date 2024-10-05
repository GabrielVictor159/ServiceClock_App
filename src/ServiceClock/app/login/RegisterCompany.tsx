import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInputMask } from 'react-native-masked-text';
import DefaultLayout from '../../components/DefaultLayout';
import { useTheme } from '../../provider/ThemeProvider';
import { createRegisterCompanyStyle } from '../../styles/App/Login/RegisterCompanyStyle';
import { ServiceFactory, ServiceType } from '../../services/ServiceFactory';
import Toast from 'react-native-toast-message';
import useKeyboardVisibility from '../../provider/KeyboardProvider';
import { useTranslation } from 'react-i18next';

interface Country {
    code: string;
    name: string;
    geonameId: string;
}

interface State {
    code: string;
    name: string;
    geonameId: string;
}

interface City {
    code: string;
    name: string;
}

const RegisterCompany: React.FC = () => {
    const { theme } = useTheme();
    const styles = createRegisterCompanyStyle(theme);
    const isKeyboardVisible = useKeyboardVisibility();
    const { t, i18n } = useTranslation();

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [cnpj, setCnpj] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [state, setState] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    const [invalidFields, setInvalidFields] = useState<string[]>([]); // Campos inválidos

    const otherService = ServiceFactory.createService(ServiceType.Other);

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
        if (country) {
            const fetchStates = async () => {
                const [data, isSuccess] = await otherService.GetChildren(countries.find((element) => element.name === country)?.geonameId || '');
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
    }, [country]);

    useEffect(() => {
        if (state) {
            const fetchCities = async () => {
                const [data, isSuccess] = await otherService.GetChildren(states.find((element) => element.name === state)?.geonameId || '');
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
    }, [state]);

    const validateFields = (): Boolean => {
        const fields = ['name', 'email', 'password', 'confirmPassword', 'cnpj', 'address', 'country', 'state', 'city', 'phoneNumber'];
        const invalid = fields.filter((field) => {
            switch (field) {
                case 'name':
                    return !name;
                case 'email':
                    return !email;
                case 'password':
                    return !password;
                case 'confirmPassword':
                    return !confirmPassword;
                case 'cnpj':
                    return !cnpj;
                case 'address':
                    return !address;
                case 'country':
                    return !country;
                case 'state':
                    return !state;
                case 'city':
                    return !city;
                case 'phoneNumber':
                    return !phoneNumber;
                default:
                    return false;
            }
        });
        setInvalidFields(invalid);
        return invalid.length === 0;
    };

    const registerCompany = async () => {
        var validInputs = validateFields();
        if (!validInputs) {
            Toast.show({
                type: 'error',
                text1: 'Campos inválidos',
                text2: 'Por favor preencha todos os dados corretamente'
            });
        }
    }

    const getInputStyle = (field: string) => {
        return invalidFields.includes(field) ? [styles.Input, styles.InputError] : styles.Input;
    };

    return (
        <>
            <DefaultLayout>
                {
                    !isKeyboardVisible ? (
                        <>
                            <View style={styles.IconContainer}>
                                <Image
                                    source={require('../../assets/management.png')}
                                    style={styles.Icon}
                                />
                            </View>
                            <Text>{"\n"}</Text>
                        </>
                    ):
                    <>
                    <Text>{"\n\n\n\n\n"}</Text>
                    </>
                }
                <View style={styles.InputContainer}>
                    <ScrollView
                        contentContainerStyle={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        showsVerticalScrollIndicator={true}

                    >
                        <View>
                            <Text style={styles.label}>{t('register.nameLabel')}</Text>
                            <TextInput
                                style={getInputStyle('name')}
                                value={name}
                                onChangeText={setName}
                                placeholder={t('register.namePlaceholder')}
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>{t('register.emailLabel')}</Text>
                            <TextInput
                                style={getInputStyle('email')}
                                value={email}
                                onChangeText={setEmail}
                                placeholder={t('register.emailPlaceholder')}
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>{t('register.passwordLabel')}</Text>
                            <TextInput
                                style={getInputStyle('password')}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                                placeholder={t('register.passwordPlaceholder')}
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>{t('register.confirmPasswordLabel')}</Text>
                            <TextInput
                                style={getInputStyle('confirmPassword')}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={true}
                                placeholder={t('register.confirmPasswordPlaceholder')}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>{t('register.cnpjLabel')}</Text>
                            <TextInputMask
                                type={'cnpj'}
                                value={cnpj}
                                onChangeText={setCnpj}
                                style={getInputStyle('cnpj')}
                                placeholder={t('register.cnpjPlaceholder')}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>{t('register.phoneLabel')}</Text>
                            <TextInputMask
                                type={'cel-phone'}
                                options={{
                                    maskType: 'BRL',
                                    withDDD: true,
                                    dddMask: '(99) '
                                }}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                style={getInputStyle('phoneNumber')}
                                placeholder={t('register.phonePlaceholder')}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>{t('register.countryLabel')}</Text>
                            <Picker
                                selectedValue={country}
                                onValueChange={(itemValue: string) => setCountry(itemValue)}
                                style={getInputStyle('country')}
                            >
                                <Picker.Item label={t('register.selectCountry')} value="" />
                                {countries.map((country) => (
                                    <Picker.Item key={country.name} label={country.name} value={country.name} />
                                ))}
                            </Picker>
                        </View>

                        <View>
                            <Text style={styles.label}>{t('register.stateLabel')}</Text>
                            <Picker
                                selectedValue={state}
                                onValueChange={(itemValue: string) => setState(itemValue)}
                                style={getInputStyle('state')}
                                enabled={country !== ''}
                            >
                                <Picker.Item label={t('register.selectState')} value="" />
                                {states.map((state) => (
                                    <Picker.Item key={state.name} label={state.name} value={state.name} />
                                ))}
                            </Picker>
                        </View>

                        <View>
                            <Text style={styles.label}>{t('register.cityLabel')}</Text>
                            <Picker
                                selectedValue={city}
                                onValueChange={(itemValue: string) => setCity(itemValue)}
                                style={getInputStyle('city')}
                                enabled={state !== ''}
                            >
                                <Picker.Item label={t('register.selectCity')} value="" />
                                {cities.map((city) => (
                                    <Picker.Item key={city.name} label={city.name} value={city.name} />
                                ))}
                            </Picker>
                        </View>

                        <View>
                            <Text style={styles.label}>{t('register.addressLabel')}</Text>
                            <TextInput
                                style={getInputStyle('address')}
                                value={address}
                                onChangeText={setAddress}
                                placeholder={t('register.addressPlaceholder')}
                            />
                        </View>
                    </ScrollView>
                </View>
                <Text>{"\n"}</Text>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => { registerCompany(); }}
                >
                    <Text style={styles.ButtonText}>{t('register.submitButton')}</Text>
                </TouchableOpacity>
            </DefaultLayout>
        </>
    );
};

export default RegisterCompany;
