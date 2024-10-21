import React, { useState } from "react";
import { Modal, View, Text, ScrollView, TouchableWithoutFeedback, TouchableOpacity, TextInput } from "react-native";
import { useTheme } from "../provider/ThemeProvider";
import { createAppointmentsViewStyle } from "../styles/Components/AppointmentsViewStyle";
import UserImage from "./UserImage";
import { useTranslation } from "react-i18next";
import { getStatusColor, getStatusText } from "../utils/AppointmentStatus";
import { formatLocaleToUTC, formatUTCToLocale } from "../utils/Dates";
import { ServiceFactory, ServiceType } from "../services/ServiceFactory";
import { AlterStateAppointmentRequest, AppointmentService } from "../services/AppointmentService";
import { useAuthentication } from "../provider/AuthenticationProvider";
import Picker from "react-native-picker-select";
import RNPickerSelect from 'react-native-picker-select';
import moment from "moment";

interface AppointmentsViewProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    appointmentsVisible: any[];
    appointments: any[];
    setAppointments: (appointmentsVisible: any[]) => void;
    setAppointmentsVisible: (appointmentsVisible: any[]) => void;
    isClient?: boolean;
    day: string | null;
    service: any | null;
}

const AppointmentsView: React.FC<AppointmentsViewProps> = ({
    visible,
    setVisible,
    appointmentsVisible,
    appointments,
    setAppointments,
    setAppointmentsVisible,
    isClient,
    day,
    service
}) => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const styles = createAppointmentsViewStyle(theme);
    const { authenticationItem } = useAuthentication();
    const [addAppointment, setAddAppointment] = useState(false);
    const [selectedHour, setSelectedHour] = useState<string | undefined>();
    const [selectedMinute, setSelectedMinute] = useState<string | undefined>();
    const [comment, setComment] = useState("");
    const appointmentService = ServiceFactory.createService(ServiceType.Appointment) as AppointmentService;

    const handleBackgroundPress = () => {
        setAddAppointment(false); setComment(""); setSelectedHour(undefined); setSelectedMinute(undefined);
        setVisible(false);
    };

    const alterState = async (appointment: any, newState: number) => {
        if (authenticationItem !== undefined) {
            let request = new AlterStateAppointmentRequest(appointment.id, newState);
            const response = await appointmentService.AlterStateAppointment(request, authenticationItem);
            if (response[1] === true) {
                const newAppointments = appointmentsVisible.map((appointmen) => {
                    if (appointmen.id === appointment.id) {
                        appointmen.status = newState;
                    }
                    return appointmen;
                });
                handleSetAppointmentsByVisible(newAppointments);
            }
        }
    };

    const handleSetAppointmentsByVisible = (newAppointments: any[]) => {
        const updatedAppointments = appointments.filter(
            (appointment) => !appointmentsVisible.some((visibleAppointment) => visibleAppointment.id === appointment.id)
        );
        const combinedAppointments = [...updatedAppointments, ...newAppointments];
        setAppointments(combinedAppointments);
        setAppointmentsVisible(newAppointments);
    };

    const handleAddAppointment = async () => {
        if (authenticationItem !== undefined) {
    
            const combinedDateTime = moment(day)
                .hour(Number(selectedHour))
                .minute(Number(selectedMinute))
                .second(0)
                .millisecond(0);

            let utcDateTime = formatLocaleToUTC(combinedDateTime.format(), i18n.language);
    
            let request = {
                ServiceId: service.id,
                Date: utcDateTime, 
                Description: comment
            };
            const response = await appointmentService.RequestAppointment(request, authenticationItem);
            if (response[1] === true) {
                const newAppointments = [response[0].appointment, ...appointmentsVisible];
                handleSetAppointmentsByVisible(newAppointments);
                setAddAppointment(false);
                setComment("");
                setSelectedHour(undefined);
                setSelectedMinute(undefined);
            }
        }
    };
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleBackgroundPress}
        >
            <View style={styles.centeredView}>
                <TouchableWithoutFeedback onPress={handleBackgroundPress}>
                    <View style={styles.background} />
                </TouchableWithoutFeedback>

                <View style={styles.modalView}>
                    {addAppointment === false && (
                        <ScrollView>
                            {appointmentsVisible.map((appointment, index) => (
                                <View key={index} style={styles.boxLine}>
                                    <UserImage
                                        width={50}
                                        height={50}
                                        source={
                                            appointment.client !== null && appointment.client !== undefined
                                                ? appointment.client.clientImage
                                                : null
                                        }
                                    />
                                    <View style={styles.textBox}>
                                        <Text style={styles.textLine}>
                                            {`${t("Name")}${appointment.client !== null && appointment.client !== undefined ? appointment.client.name : ""}`}
                                        </Text>
                                        <Text style={styles.textLine}>
                                            {`${t("Address")}${appointment.client !== null && appointment.client !== undefined
                                                ? appointment.client.address + ", " + appointment.client.state + ", " + appointment.client.city + ", " + appointment.client.postalCode
                                                : ""}`}
                                        </Text>
                                        <Text style={styles.textLine}>
                                            {`${t("CreationDate")}${formatUTCToLocale(appointment.createdAt, i18n.language)}`}
                                        </Text>
                                        <Text style={styles.textLine}>
                                            {`${t("ScheduledDate")}${formatUTCToLocale(appointment.date, i18n.language)}`}
                                        </Text>
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                            <Text>{`${t("Status")}${t(getStatusText(appointment.status))}`}</Text>
                                            <View style={{ width: 20, height: 20, borderRadius: 20, backgroundColor: getStatusColor(appointment.status) }}></View>
                                        </View>
                                        <Text style={styles.textLine}>{`${t("Comment")}${appointment.description}`}</Text>
                                        {
                                            (appointment.status === 1 && isClient !== true) && (
                                                <View style={styles.ButtonBox}>
                                                    <TouchableOpacity
                                                        style={styles.Button}
                                                        onPress={() => { alterState(appointment, 2); }}
                                                    >
                                                        <Text style={styles.ButtonText}>{t('appointmentView.Aprove')}</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={styles.Button}
                                                        onPress={() => { alterState(appointment, 3); }}
                                                    >
                                                        <Text style={styles.ButtonText}>{t('appointmentView.Reject')}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        }
                                        {
                                            appointment.status === 2 && (
                                                <View style={styles.ButtonBox}>
                                                    <TouchableOpacity
                                                        style={styles.Button}
                                                        onPress={() => { alterState(appointment, 4); }}
                                                    >
                                                        <Text style={styles.ButtonText}>{t('appointmentView.Cancel')}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        }
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                    {
                        addAppointment === true && (
                            <View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Text style={{ marginRight: 10 }}>{t('appointmentView.Hour')}</Text>
                                    <View style={styles.inputHourBox}>
                                        <RNPickerSelect
                                            onValueChange={(itemValue) => setSelectedHour(itemValue)}
                                            placeholder={{
                                                label: 'Hour',
                                                value: null
                                            }}
                                            items={Array.from({ length: 24 }, (_, i) => ({
                                                label: i.toString().padStart(2, '0'),
                                                value: i,
                                                key: i
                                            }))}
                                            value={selectedHour}
                                            style={{
                                                inputAndroid: styles.inputHour,
                                                inputIOS: styles.inputHour
                                            }}
                                        />
                                    </View>
                                    <Text style={{ marginHorizontal: 5 }}>:</Text>
                                    <View style={styles.inputHourBox}>
                                        <RNPickerSelect
                                            onValueChange={(itemValue) => setSelectedMinute(itemValue)}
                                            placeholder={{
                                                label: 'Minute',
                                                value: null
                                            }}
                                            items={Array.from({ length: 60 }, (_, i) => ({
                                                label: i.toString().padStart(2, '0'),
                                                value: i,
                                                key: i
                                            }))}
                                            value={selectedMinute}
                                            style={{
                                                inputAndroid: styles.inputHour,
                                                inputIOS: styles.inputHour
                                            }}
                                        />
                                    </View>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Text style={{ marginRight: 10 }}>{t('appointmentView.Comment')}</Text>
                                    <TextInput
                                        multiline
                                        numberOfLines={4}
                                        placeholder={t('appointmentView.CommentPlaceholder')}
                                        style={styles.inputComment}
                                        onChangeText={(text) => setComment(text)}
                                        value={comment}
                                    />
                                </View>
                                <View style={styles.ButtonLine}>
                                    <TouchableOpacity
                                        style={styles.Button}
                                        onPress={() => { setAddAppointment(false); setComment(""); setSelectedHour(undefined); setSelectedMinute(undefined); }}
                                    >
                                        <Text style={styles.ButtonText}>{t('appointmentView.Cancel')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.Button}
                                        onPress={() => { handleAddAppointment();}}
                                    >
                                        <Text style={styles.ButtonText}>{t('appointmentView.Add')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }

                    {(isClient === true && addAppointment === false) && (
                        <>
                            <TouchableOpacity
                                style={styles.ButtonAddAppointment}
                                onPress={() => setAddAppointment(true)}
                            >
                                <Text style={styles.ButtonText}>{t('appointmentView.adicionarApontamento')}</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default AppointmentsView;
