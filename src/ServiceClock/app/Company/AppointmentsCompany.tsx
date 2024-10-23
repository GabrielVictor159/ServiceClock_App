import React, { useEffect, useState } from 'react'; 
import DefaultLayout from '../../components/DefaultLayout';
import AppointmentsCalendar from '../../components/AppointmentsCalendar';


const AppointmentsCompany: React.FC = () => {

    return (
        <DefaultLayout>
            <>
            <AppointmentsCalendar />
            </>
        </DefaultLayout>
    );
};

export default AppointmentsCompany;
