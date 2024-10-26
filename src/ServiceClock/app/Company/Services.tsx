import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import DefaultLayout from '../../components/DefaultLayout';
import { useTheme } from '../../provider/ThemeProvider';
import { createServiceStyle } from '../../styles/App/Company/ServicesStyle';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { ServiceFactory, ServiceType } from '../../services/ServiceFactory';
import { CreateServiceRequest, GetServiceRequest, ServicesService } from '../../services/ServicesService';
import { AuthenticationItem, useAuthentication } from '../../provider/AuthenticationProvider';
import ServicesLine from '../../components/ServicesLine';
import ServiceEdit from '../../components/ServiceEdit';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const Services: React.FC = () => {
    const { theme } = useTheme();
    const styles = createServiceStyle(theme);
    const { t, i18n } = useTranslation();
    const { authenticationItem } = useAuthentication();
    const [services, setServices] = useState<any[]>([]);
    const [newItem, setNewItem] = useState(false);

    const servicesService = ServiceFactory.createService(ServiceType.Services) as ServicesService;

    const listServices = async () => {
        if (authenticationItem) {
            let request = new GetServiceRequest();
            request.IndexPage = 1;
            request.PageSize = 1000;
            var response = await servicesService.GetServices(request, authenticationItem);
            setServices(response[0].services);
        }
    };

    useFocusEffect(
        useCallback(() => {
            listServices();
        }, [])
    );

    const onSaveNewItem = async (newService: any) => {
        if (authenticationItem) {
            let request = new CreateServiceRequest(newService.name, newService.description, 
                newService.address, newService.city, newService.state, 
                newService.country, newService.postalCode);
            
            const [data, isSuccess] = await servicesService.CreateService(request, authenticationItem);
            if (isSuccess) {
                listServices();
                setNewItem(false);
            }
        }
    }
    const onCancelNewItem = () => {
        setNewItem(false);
    }
    return (
        <>
            <DefaultLayout>
                <Image source={require("../../assets/service.png")} style={styles.icon} />
                <Text style={styles.headerText}>{t("Services")}</Text>
                <View style={styles.boxServices}>
                    <ScrollView>
                        {services.map((service, index) => {
                            return (
                                <ServicesLine refreshServices={listServices} service={service} key={index} />
                            );
                        })}
                    </ScrollView>
                    <View style={styles.addServiceLine}>
                        <TouchableOpacity style={styles.addServiceButton} onPress={() => setNewItem(true)}>
                            <Text style={styles.addServiceText}>{t("Service.AddService")}</Text>
                        </TouchableOpacity>
                    </View>

                    <Modal visible={newItem} animationType="slide" transparent={true}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <ServiceEdit onSave={onSaveNewItem} onCancel={onCancelNewItem} />
                            </View>
                        </View>
                    </Modal>
                </View>
            </DefaultLayout>
        </>
    );
};


export default Services;