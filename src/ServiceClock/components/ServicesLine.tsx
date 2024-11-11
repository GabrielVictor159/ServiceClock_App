import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Theme, useTheme } from '../provider/ThemeProvider';
import ServiceEdit from './ServiceEdit';
import { DeleteServiceRequest, EditServiceRequest, ServicesService } from '../services/ServicesService';
import { ServiceFactory, ServiceType } from '../services/ServiceFactory';
import { useAuthentication } from '../provider/AuthenticationProvider';

interface ServicesLineProps {
    service: any;
    refreshServices?: () => void;
}

const ServicesLine: React.FC<ServicesLineProps> = ({ service, refreshServices }) => {
    const [editable, setEditable] = useState(false);
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { authenticationItem } = useAuthentication();

    const servicesService = ServiceFactory.createService(ServiceType.Services) as ServicesService;

    const onSave = async (updatedService: any) => {
        if (authenticationItem) {
            let request = new EditServiceRequest(service.id);
            request.Name = updatedService.name;
            request.Description = updatedService.description;
            request.Address = updatedService.address;
            request.City = updatedService.city;
            request.State = updatedService.state;
            request.Country = updatedService.country;
            request.PostalCode = updatedService.postalCode;
            const [data, isSuccess] = await servicesService.EditService(request, authenticationItem);

            if (isSuccess) {
                if (refreshServices) {
                    refreshServices();
                }
                setEditable(false);
            }
            setEditable(false);
        }
    };

    const onCancel = () => {
        setEditable(false);
    };

    const onDelete = async () => {
        if (authenticationItem) {
            let request = new DeleteServiceRequest(service.id);
            const [data, isSuccess] = await servicesService.DeleteService(request, authenticationItem);
            if (isSuccess) {
                if (refreshServices) {
                    refreshServices();
                }
            }
        }
        setDeleteConfirmVisible(false);
    };

    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <Text>{`${t("Service.Name")}: ${service.name}`}</Text>
            <Text>{`${t("Service.Description")}: ${service.description}`}</Text>
            <Text>{`${t("Service.Address")}: ${service.address}`}</Text>
            <Text>{`${t("Service.City")}: ${service.city}`}</Text>
            <Text>{`${t("Service.State")}: ${service.state}`}</Text>
            <Text>{`${t("Service.Country")}: ${service.country}`}</Text>
            <Text>{`${t("Service.PostalCode")}: ${service.postalCode}`}</Text>

            <View style={styles.buttonLine}>
                <TouchableOpacity onPress={() => setEditable(true)} style={styles.button}>
                    <Text style={styles.textButton}>{t("Service.Edit")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDeleteConfirmVisible(true)} style={{ ...styles.button, backgroundColor: '#e65c53' }}>
                    <Text style={styles.textButton}>{t("Service.Delete")}</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={editable} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ServiceEdit service={service} onSave={onSave} onCancel={onCancel} />
                    </View>
                </View>
            </Modal>

            <Modal visible={deleteConfirmVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>{t("Service.ConfirmDelteMessage")}</Text>
                        <View style={styles.buttonLine}>
                            <TouchableOpacity onPress={onDelete} style={styles.button}>
                                <Text style={styles.textButton}>{t("Service.Confirm")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setDeleteConfirmVisible(false)} style={{ ...styles.button, backgroundColor: '#e65c53' }}>
                                <Text style={styles.textButton}>{t("Service.Cancel")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.endBorder}></View>
        </View>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingHorizontal: 20,
            marginTop: 10,
            paddingBottom: 10,
        },
        endBorder: {
            width: '100%',
            height: 2,
            backgroundColor: 'black',
            marginTop: 10,
        },
        buttonLine: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
        },
        button: {
            backgroundColor: '#469bc6',
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
        },
        textButton: {
            color: 'white',
            fontWeight: 'bold',
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            width: '90%',
            alignItems: 'center',
            gap: 10,
        },
    });

export default ServicesLine;
