import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import 'intl-pluralrules'; 

const resources = {
    en: {
        translation: {
            selectLanguage: "Select Language",
            welcome: "Welcome",
            home: {
                button1: "Login",
                button2: "Register Company",
                subText: "Service scheduling for users",
            },
            login: {
                labelEmail: "Email",
                placeholderEmail: "Type your email",
                labelPassword: "Password",
                placeholderPassword: "Type your password",
                button: "Login",
            },
            register: {
                nameLabel: "Name",
                namePlaceholder: "Enter your name",
                emailLabel: "Email",
                emailPlaceholder: "Enter your email",
                passwordLabel: "Password",
                passwordPlaceholder: "Enter your password",
                confirmPasswordLabel: "Confirm Password",
                confirmPasswordPlaceholder: "Confirm your password",
                cnpjLabel: "CNPJ",
                cnpjPlaceholder: "Enter your CNPJ",
                phoneLabel: "Phone",
                phonePlaceholder: "Enter your phone number",
                countryLabel: "Country",
                selectCountry: "Select a country",
                stateLabel: "State",
                selectState: "Select a state",
                cityLabel: "City",
                selectCity: "Select a city",
                addressLabel: "Address",
                addressPlaceholder: "Enter your address",
                submitButton: "Register"
            },
            error: {
                invalidFields: {
                    title: "Invalid Fields",
                    message: "Please fill in all required fields."
                }
            }
        }
    },
    pt: {
        translation: {
            selectLanguage: "Selecione o Idioma",
            welcome: "Bem-vindo",
            home: {
                button1: "Entrar",
                button2: "Registrar Empresa",
                subText: "Serviço de agendamento de serviços para usuários",
            },
            login: {
                labelEmail: "E-mail",
                placeholderEmail: "Digite seu e-mail",
                labelPassword: "Senha",
                placeholderPassword: "Digite sua senha",
                button: "Entrar",
            },
            register: {
                nameLabel: "Nome",
                namePlaceholder: "Digite seu nome",
                emailLabel: "E-mail",
                emailPlaceholder: "Digite seu e-mail",
                passwordLabel: "Senha",
                passwordPlaceholder: "Digite sua senha",
                confirmPasswordLabel: "Confirmar Senha",
                confirmPasswordPlaceholder: "Confirme sua senha",
                cnpjLabel: "CNPJ",
                cnpjPlaceholder: "Digite seu CNPJ",
                phoneLabel: "Telefone",
                phonePlaceholder: "Digite seu número de telefone",
                countryLabel: "País",
                selectCountry: "Selecione um país",
                stateLabel: "Estado",
                selectState: "Selecione um estado",
                cityLabel: "Cidade",
                selectCity: "Selecione uma cidade",
                addressLabel: "Endereço",
                addressPlaceholder: "Digite seu endereço",
                submitButton: "Registrar"
            },
            error: {
                invalidFields: {
                    title: "Campos Inválidos",
                    message: "Por favor, preencha todos os campos obrigatórios."
                }
            }
        }
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "pt",
        fallbackLng: "pt",
        interpolation: {
            escapeValue: false,
        },
        supportedLngs: ['en', 'pt'],
        compatibilityJSON: 'v3'
    });

export default i18n;
