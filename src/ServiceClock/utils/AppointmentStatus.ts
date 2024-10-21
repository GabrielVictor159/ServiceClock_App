export enum AppointmentStatus{
    PendingApproval = 1,
    Approved = 2,
    Rejected = 3,
    Canceled = 4,
    Completed = 5
}

export const getStatusColor = (status: AppointmentStatus) : string => {
    switch (status) {
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
}

export const getStatusText = (status: AppointmentStatus) : string => {
    switch (status) {
        case AppointmentStatus.PendingApproval:
            return 'appointmentStatus.PendingApproval'; 
        case AppointmentStatus.Approved:
            return 'appointmentStatus.Approved';
        case AppointmentStatus.Rejected:
            return 'appointmentStatus.Rejected'; 
        case AppointmentStatus.Canceled:
            return 'appointmentStatus.Canceled'; 
        case AppointmentStatus.Completed:
            return 'appointmentStatus.Completed'; 
        default:
            return 'Unknown'; 
    }
}