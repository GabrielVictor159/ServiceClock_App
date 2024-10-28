import React, { useRef } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import { useTheme } from '../provider/ThemeProvider';
import { createEditPropertyStyle } from '../styles/Components/EditPropertyStyle';
import Toast from 'react-native-toast-message';

interface EditPropertyProps {
    title?: string;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onSave: () => void;
    children: React.ReactNode;
}

const EditProperty: React.FC<EditPropertyProps> = ({ title, visible, setVisible, onSave, children }) => {
    const { theme } = useTheme();

    const styles = createEditPropertyStyle(theme);
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {title && (
                        <Text style={styles.modalTitle}>{title}</Text>)
                    }
                    {children}
                    <View style={styles.buttonContainer}>
                        <Button title="Cancelar" onPress={() => setVisible(false)} />
                        <Button title="Salvar" onPress={onSave} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default EditProperty;
