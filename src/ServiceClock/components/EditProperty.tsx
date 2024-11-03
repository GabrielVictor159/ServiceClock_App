import React, { useRef } from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../provider/ThemeProvider';
import { createEditPropertyStyle } from '../styles/Components/EditPropertyStyle';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

interface EditPropertyProps {
    title?: string;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onSave: () => void;
    children: React.ReactNode;
}

const EditProperty: React.FC<EditPropertyProps> = ({ title, visible, setVisible, onSave, children }) => {
    const { theme } = useTheme();
    const {t} = useTranslation();

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
                        <TouchableOpacity style={styles.button} onPress={onSave}>
                            <Text style={styles.textButton}>{t("Save")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{...styles.button, backgroundColor:theme.redColor}} onPress={() => setVisible(false)} >
                            <Text style={styles.textButton}>{t("Cancel")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default EditProperty;
