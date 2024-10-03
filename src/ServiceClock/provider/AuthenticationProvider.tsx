import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthenticationContextType {
    authenticationItem: AuthenticationItem | undefined;
    setAuthenticationItem: (newAuthenticationItem: AuthenticationItem) => void;
}

export class AuthenticationItem {
    Email: string;
    Token: string;
    Type: string;

    constructor(Email: string, Token: string, Type: string) {
        this.Email = Email;
        this.Token = Token;
        this.Type = Type;
    }
}

const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

const AuthenticationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authenticationItem, setAuthenticationItem] = useState<AuthenticationItem | undefined>(undefined);

    const updateAuthenticationItem = async (newAuthenticationItem: AuthenticationItem) => {
        setAuthenticationItem(newAuthenticationItem);
        
        await AsyncStorage.setItem('authenticationItem', JSON.stringify(newAuthenticationItem));
    };

    return (
        <AuthenticationContext.Provider value={{ authenticationItem, setAuthenticationItem: updateAuthenticationItem }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

const useAuthentication = () => {
    const context = useContext(AuthenticationContext);
    if (!context) {
        throw new Error('useAuthentication must be used within an AuthenticationProvider');
    }
    return context;
};

export { AuthenticationProvider, useAuthentication };
