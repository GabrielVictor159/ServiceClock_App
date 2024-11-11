import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { City, Country, OtherServices, State } from '../services/OtherServices';
import { ServiceFactory, ServiceType } from '../services/ServiceFactory';
import geral from '../styles/Common/Geral';
import { TextInputMask } from 'react-native-masked-text';
import { ScrollView } from 'react-native-gesture-handler';

interface ServiceEditProps {
    service?: any;
    onSave: (updatedService: any) => void;
    onCancel: () => void;
}

const ServiceEdit: React.FC<ServiceEditProps> = ({ service, onSave, onCancel }) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    const [address, setAddress] = useState(service?.address || '');
    const [city, setCity] = useState<City | undefined>(undefined);
    const [state, setState] = useState<State | undefined>(undefined);
    const [country, setCountry] = useState<Country | undefined>(undefined);
    const [postalCode, setPostalCode] = useState(service?.postalCode || '');
    const [name, setName] = useState(service?.name || '');
    const [description, setDescription] = useState(service?.description || '');

    const { t } = useTranslation();
    const otherService = ServiceFactory.createService(ServiceType.Other) as OtherServices;

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
                if (service) {
                    const selectedCountry = formattedCountries.find((c) => c.name === service.country);
                    if (selectedCountry) setCountry(selectedCountry);
                }
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
                    if (service && service.state) {
                        const selectedState = formattedStates.find((s) => s.name === service.state);
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
                    if (service && service.city) {
                        const selectedCity = formattedCities.find((c) => c.name === service.city);
                        if (selectedCity) setCity(selectedCity);
                    }
                }
            };
            fetchCities();
        }
    }, [state]);

    const handleSave = () => {
        const updatedService = { name, description, address, city: city?.name, state: state?.name, country: country?.name, postalCode };
        onSave(updatedService);
    };

    return (
        <>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ScrollView>
                        <View style={styles.lineInput}>
                            <Text>{t("Service.Name")}</Text>
                            <TextInput style={styles.input} value={name} placeholder={t("Service.Name")} onChangeText={setName} />
                        </View>

                        <View style={styles.lineInput}>
                            <Text>{t("Service.Description")}</Text>
                            <TextInput style={styles.input} value={description} placeholder={t("Service.Description")} onChangeText={setDescription} />
                        </View>

                        <View style={styles.lineInput}>
                            <Text>{t("Service.Address")}</Text>
                            <TextInput style={styles.input} value={address} placeholder={t("Service.Address")} onChangeText={setAddress} />
                        </View>

                        <View style={styles.lineInput}>
                            <Text>{t("Service.PostalCode")}</Text>
                            <TextInputMask type={'zip-code'} style={styles.input} value={postalCode} placeholder={t("Service.PostalCode")} onChangeText={setPostalCode} />
                        </View>

                        <View style={styles.selectLine}>
                            <Text>{t("Service.SelectCountry")}</Text>
                            <View style={styles.selectBox}>
                                <Picker selectedValue={country} onValueChange={(value) => setCountry(value)} style={styles.select}>
                                    <Picker.Item label={t("Service.SelectCountry")} value={undefined} style={styles.pickerLabel} />
                                    {countries.map((c) => (
                                        <Picker.Item key={`country ${c.geonameId}`} label={c.name} value={c} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.selectLine}>
                            <Text>{t("Service.SelectState")}</Text>
                            <View style={styles.selectBox}>
                                <Picker selectedValue={state} onValueChange={(value) => setState(value)} style={styles.select}>
                                    <Picker.Item label={t("Service.SelectState")} value={undefined} style={styles.pickerLabel} />
                                    {states.map((s) => (
                                        <Picker.Item key={`state ${s.geonameId}`} label={s.name} value={s} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.selectLine}>
                            <Text>{t("Service.SelectCity")}</Text>
                            <View style={styles.selectBox}>
                                <Picker selectedValue={city} onValueChange={(value) => setCity(value)} style={styles.select}>
                                    <Picker.Item label={t("Service.SelectCity")} value={undefined} style={styles.pickerLabel} />
                                    {cities.map((c) => (
                                        <Picker.Item key={`city ${c.code}`} label={c.name} value={c} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                    </ScrollView>
                </View>
            </View>
            <View style={styles.buttonLine}>
                <TouchableOpacity onPress={handleSave} style={styles.button}>
                    <Text style={styles.textButton}>{t("Service.Save")}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onCancel} style={{ ...styles.button, backgroundColor: '#e65c53' }}>
                    <Text style={styles.textButton}>{t("Service.Cancel")}</Text>
                </TouchableOpacity>
            </View>

        </>
    );
};


const styles = StyleSheet.create({
    input: { borderWidth: 1, borderRadius: 10, borderColor: '#ccc', padding: 8, flexGrow: 1 },
    selectLine: {
        width:200,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    selectBox: {
        borderWidth: 2,
        borderColor: '#e3e3e3',
        borderRadius: 10,
        overflow: 'hidden',
        flexGrow:1
    },
    buttonLine: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical:10,
        gap: 10,
    },
    pickerLabel: {
        color: '#707070',
    },
    select: {
        height: 55,
        paddingHorizontal: 10,
    },
    lineInput: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 10,
        alignItems: 'center',
        marginTop: 10
    },
    button: {
        backgroundColor: '#469bc6',
        padding: 10,
        borderRadius: 5,
    },
    textButton: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalContainer: {
        width:'100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        height: 300,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        gap: 10,
    },
});

export default ServiceEdit;
