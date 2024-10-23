import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import RNPickerSelect from 'react-native-picker-select';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useTheme } from '../provider/ThemeProvider';
import { createAppointmentsCalendarStyle } from '../styles/Components/AppointmentsCalendarStyle';
import { useAuthentication } from '../provider/AuthenticationProvider';
import { ServiceFactory, ServiceType } from '../services/ServiceFactory';
import { GetServiceRequest, ServicesService } from '../services/ServicesService';
import { AppointmentService, ListAppointmentRequest } from '../services/AppointmentService';
import { AppointmentStatus } from '../utils/AppointmentStatus';
import DefaultLayout from './DefaultLayout';
import AppointmentsView from './AppointmentsView';
import Toast from 'react-native-toast-message';

interface AppointmentsCalendarProps {
    isClient?: boolean;
}

const AppointmentsCalendar: React.FC<AppointmentsCalendarProps> = ({isClient }: AppointmentsCalendarProps) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const styles = createAppointmentsCalendarStyle(theme);
    const [services, setServices] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState<any | null>(null);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [markedDates, setMarkedDates] = useState<any>({});
    const { authenticationItem } = useAuthentication();
    const [visibleYear, setVisibleYear] = useState<number | null>(null);
    const [visibleRange, setVisibleRange] = useState<{ start: string; end: string } | null>(null);
    const [appointmentVisible, setAppointmentVisible] = useState(false);
    const [selectAppointments, setSelectAppointments] = useState<any[]>([]);
    const [selectDay, setSelectDay] = useState<string | null>(null);

    const servicesService = ServiceFactory.createService(ServiceType.Services) as ServicesService;

    const handleVisibleMonthsChange = (months: { month: number, year: number }[]) => {
        if (months.length > 0) {
            const newYear = months[0].year;
            if (newYear !== visibleYear) {
                const startOfYear = moment(`${newYear}-01-01`).startOf('year').toISOString();
                const endOfYear = moment(`${newYear}-12-31`).endOf('year').toISOString();

                setVisibleYear(newYear);
                setVisibleRange({ start: startOfYear, end: endOfYear });
                setMarkedDates({});
            }
        }
    };

    const setInitialVisibleRange = () => {
        const currentDate = moment();
        const startOfYear = currentDate.startOf('year').toISOString();
        const endOfYear = currentDate.endOf('year').toISOString();
        setVisibleYear(currentDate.year());
        setVisibleRange({ start: startOfYear, end: endOfYear });
    };

    useEffect(() => {
        listServices();
        setInitialVisibleRange();
    }, []);
    const appointmentService = ServiceFactory.createService(ServiceType.Appointment) as AppointmentService;

    useEffect(() => {
        const listAppointment = async () => {
            if (selectedService && visibleRange) {
                var request = new ListAppointmentRequest();
                if(isClient)
                {
                    request.ClientId = authenticationItem?.UserId;
                }
                request.ServiceId = selectedService.id;
                request.PageSize = 1000;
                request.IndexPage = 1;
                request.MinDate = visibleRange.start;
                request.MaxDate = visibleRange.end;
                if (authenticationItem) {
                    var response = await appointmentService.ListAppointments(request, authenticationItem);
                    setAppointments(response[0].appointments);
                }
            }
        };

        listAppointment();
    }, [selectedService, visibleRange]);

    useEffect(() => {
        markAppointmentDates(appointments);
    }, [appointments]);

    const markAppointmentDates = (appointments: any[]) => {
        const markedDatesObj: any = {};

        appointments.forEach(appointment => {
            const dateKey = moment(appointment.date).format('YYYY-MM-DD');
            const statusColor = getStatusColor(dateKey);

            markedDatesObj[dateKey] = {
                customStyles: {
                    container: {
                        backgroundColor: statusColor,
                        borderRadius: 20,
                    },
                    text: {
                        color: 'white',
                        fontWeight: 'bold',
                    }
                }
            };
        });

        setMarkedDates(markedDatesObj);
    };

    const getStatusColor = (date: string) => {
        const appointmentsForDay = appointments.filter(appointment =>
            moment(appointment.date).format('YYYY-MM-DD') === date
        );

        if (appointmentsForDay.length === 0) {
            return 'blue';
        }

        const statuses = appointmentsForDay.map(appointment => appointment.status);
        const minStatus = Math.min(...statuses);

        switch (minStatus) {
            case AppointmentStatus.PendingApproval:
                return '#0dc3d6';
            case AppointmentStatus.Approved:
                return 'green';
            case AppointmentStatus.Rejected:
                return 'red';
            case AppointmentStatus.Canceled:
                return 'orange';
            case AppointmentStatus.Completed:
                return 'purple';
            default:
                return 'blue';
        }
    };

    const listServices = async () => {
        if (authenticationItem) {
            let request = new GetServiceRequest();
            request.IndexPage = 1;
            request.PageSize = 1000;
            var response = await servicesService.GetServices(request, authenticationItem);
            setServices(response[0].services);
        }
    };

    const handleDayPress = (day: any) => {
        const clickedDate = moment(day.dateString).format('YYYY-MM-DD');

        const filteredAppointments = appointments.filter(appointment =>
            moment(appointment.date).format('YYYY-MM-DD') === clickedDate
        );

        const sortedAppointments = filteredAppointments.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        const isFutureOrToday = moment(clickedDate).isSameOrAfter(moment().startOf('day'));
        if(!isFutureOrToday){
            Toast.show({
                type: 'info',
                text1: t('AppointmentsDayPressNotFutureErrorHearder'),
                text2: t('AppointmentsDayPressNotFutureError')
            });
        }
        setAppointmentVisible(isClient?isFutureOrToday:(sortedAppointments.length>0 && isFutureOrToday));
        setSelectAppointments(sortedAppointments);
        setSelectDay(clickedDate);
    };


    return (
        <>
            <Image source={require('../assets/schedule.png')} style={styles.image} />
            <Text style={styles.textHeader}>{t('appointmentsHeader')}</Text>
            <View style={styles.linePicker}>
                <RNPickerSelect
                    onValueChange={(value: string | null) => setSelectedService(value)}
                    items={services.map(service => ({
                        label: service.name,
                        value: service,
                    }))}
                    placeholder={{
                        label: t('selectServicePlaceholder'),
                        value: null,
                    }}
                    style={{
                        inputIOS: styles.picker,
                        inputAndroid: styles.picker,
                    }}
                />
            </View>
            {selectedService && (
                <>
                    <View style={styles.descriptionBox}>
                        <Text>{`${t("Description")}${selectedService.description}`}</Text>
                        <Text>{`${t("Address")}${selectedService.address + ", " + selectedService.city + ", " + selectedService.state + ", " + selectedService.country + ", " + selectedService.postalCode}`}</Text>
                    </View>
                </>
            )
            }
            <Text>{"\n"}</Text>
            <Calendar
                style={styles.Calendar}
                onVisibleMonthsChange={handleVisibleMonthsChange}
                markedDates={markedDates}
                onDayPress={handleDayPress}
                markingType={'custom'}
            />
            <AppointmentsView service={selectedService} day={selectDay} isClient={isClient} visible={appointmentVisible} setVisible={setAppointmentVisible} appointmentsVisible={selectAppointments} appointments={appointments} setAppointments={setAppointments} setAppointmentsVisible={setSelectAppointments} />
        </>
    );
}

export default AppointmentsCalendar;