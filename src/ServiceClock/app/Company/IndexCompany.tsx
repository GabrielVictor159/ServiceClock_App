import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DefaultLayout from '../../components/DefaultLayout';
import { Calendar } from 'react-native-calendars';

const IndexCompany: React.FC = () => {
    return (
        <>
            <DefaultLayout>
                <Calendar

                />
            </DefaultLayout>
        </>
    );
};

export default IndexCompany;