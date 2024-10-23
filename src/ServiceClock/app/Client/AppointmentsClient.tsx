import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DefaultLayout from '../../components/DefaultLayout';
import AppointmentsCalendar from '../../components/AppointmentsCalendar';

const AppointmentsClient: React.FC = () => {
    return (
        <>
        <DefaultLayout>
            <>
            <AppointmentsCalendar isClient={true}/>
            </>
        </DefaultLayout>
        </>
    );
};

export default AppointmentsClient;