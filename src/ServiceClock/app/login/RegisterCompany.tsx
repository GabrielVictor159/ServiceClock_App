import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInputMask } from 'react-native-masked-text';
import DefaultLayout from '../../components/DefaultLayout';
import { useTheme } from '../../provider/ThemeProvider';
import { createRegisterCompanyStyle } from '../../styles/App/Login/RegisterCompanyStyle';

// Tipos para País, Estado e Cidade
interface Country {
    code: string;
    name: string;
}

interface State {
    code: string;
    name: string;
}

interface City {
    code: string;
    name: string;
}

const RegisterCompany: React.FC = () => {
    const { theme } = useTheme();
    const styles = createRegisterCompanyStyle(theme);

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

    //aplicar api's
    useEffect(() => {
        // fetch('https://api.example.com/countries')
        //     .then((response) => response.json())
        //     .then((data: Country[]) => setCountries(data))
        //     .catch((error) => console.error('Error fetching countries:', error));
    }, []);

    useEffect(() => {
        if (country) {
            fetch(`https://api.example.com/states?country=${country}`)
                .then((response) => response.json())
                .then((data: State[]) => setStates(data))
                .catch((error) => console.error('Error fetching states:', error));
        }
    }, [country]);

    useEffect(() => {
        if (state) {
            fetch(`https://api.example.com/cities?state=${state}`)
                .then((response) => response.json())
                .then((data: City[]) => setCities(data))
                .catch((error) => console.error('Error fetching cities:', error));
        }
    }, [state]);

    return (
        <>
            <DefaultLayout>
                <View>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.Input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Digite o nome"
                    />
                </View>
                <View>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.Input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Digite o email"
                    />
                </View>
                <View>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        style={styles.Input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        placeholder="Digite sua senha"
                    />
                </View>
                <View>
                    <Text style={styles.label}>Confirmar Senha</Text>
                    <TextInput
                        style={styles.Input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={true}
                        placeholder="Confirme sua senha"
                    />
                </View>

                <View>
                    <Text style={styles.label}>CNPJ</Text>
                    <TextInputMask
                        type={'cnpj'}
                        value={cnpj}
                        onChangeText={setCnpj}
                        style={styles.Input}
                        placeholder="Digite o CNPJ"
                    />
                </View>

                <View>
                    <Text style={styles.label}>Telefone</Text>
                    <TextInputMask
                        type={'cel-phone'}
                        options={{
                            maskType: 'BRL',
                            withDDD: true,
                            dddMask: '(99) '
                        }}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        style={styles.Input}
                        placeholder="Digite o telefone"
                    />
                </View>

                <View>
                    <Text style={styles.label}>País</Text>
                    <Picker
                        selectedValue={country}
                        onValueChange={(itemValue: string) => setCountry(itemValue)}
                        style={styles.Input}
                    >
                        <Picker.Item label="Selecione o país" value="" />
                        {countries.map((country) => (
                            <Picker.Item key={country.code} label={country.name} value={country.code} />
                        ))}
                    </Picker>
                </View>

                <View>
                    <Text style={styles.label}>Estado</Text>
                    <Picker
                        selectedValue={state}
                        onValueChange={(itemValue: string) => setState(itemValue)}
                        style={styles.Input}
                        enabled={country !== ''}
                    >
                        <Picker.Item label="Selecione o estado" value="" />
                        {states.map((state) => (
                            <Picker.Item key={state.code} label={state.name} value={state.code} />
                        ))}
                    </Picker>
                </View>

                <View>
                    <Text style={styles.label}>Cidade</Text>
                    <Picker
                        selectedValue={city}
                        onValueChange={(itemValue: string) => setCity(itemValue)}
                        style={styles.Input}
                        enabled={state !== ''} 
                    >
                        <Picker.Item label="Selecione a cidade" value="" />
                        {cities.map((city) => (
                            <Picker.Item key={city.code} label={city.name} value={city.code} />
                        ))}
                    </Picker>
                </View>

                <View>
                    <Text style={styles.label}>Endereço</Text>
                    <TextInput
                        style={styles.Input}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Digite o endereço"
                    />
                </View>
            </DefaultLayout>
        </>
    );
};

export default RegisterCompany;
