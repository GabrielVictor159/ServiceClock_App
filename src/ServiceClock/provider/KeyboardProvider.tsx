import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Keyboard } from 'react-native';

interface KeyboardContextType {
    isKeyboardHidden: boolean;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined);

const KeyboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isKeyboardHidden, setIsKeyboardHidden] = useState<boolean>(true);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardHidden(false));
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardHidden(true));

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <KeyboardContext.Provider value={{ isKeyboardHidden }}>
            {children}
        </KeyboardContext.Provider>
    );
};

const useKeyboard = () => {
    const context = useContext(KeyboardContext);
    if (!context) {
        throw new Error('useKeyboard must be used within a KeyboardProvider');
    }
    return context;
};

export { KeyboardProvider, useKeyboard };
