import axios from "axios";
import { Environment, EnvironmentType } from "../Environment";
import { AuthenticationItem } from "../provider/AuthenticationProvider";
import Toast from "react-native-toast-message";

export class AppointmentService {
    environment: EnvironmentType;
    constructor() {
        this.environment = new Environment();
    }

    public async ListAppointments(data:ListAppointmentRequest,authenticationItem:AuthenticationItem): Promise<[any, boolean]> {
        try {
            var response = await axios.post(`${this.environment.apiUrl}ListAppointment`,data,{
                headers:{
                    Authorization: `${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            console.log(error);
            return [error, false];
        }
    }

    public async RequestAppointment(data:RequestAppointmentRequest,authenticationItem:AuthenticationItem): Promise<[any, boolean]> {
        try {
            var response = await axios.post(`${this.environment.apiUrl}RequestAppointment`,data,{
                headers:{
                    Authorization: `${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.data[0].Message});
            return [error, false];
        }
    }

    public async AlterStateAppointment(data:AlterStateAppointmentRequest,authenticationItem:AuthenticationItem): Promise<[any, boolean]> {
        try {
            var response = await axios.post(`${this.environment.apiUrl}AlterStateAppointment`,data,{
                headers:{
                    Authorization: `${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.data[0].Message
            });
            return [error, false];
        }
    }
}

export class ListAppointmentRequest{
    Id?:string;
    ServiceId?:string;
    ClientId?:string;
    MinDate?:string;
    MaxDate?:string;
    Description?:string;
    Status?:number;
    CreatedAt?:string;
    IndexPage?:number;
    PageSize?:number;
}

export class RequestAppointmentRequest{
    ServiceId:string;
    Date:string;
    Description:string;

    constructor(serviceId:string, date:string,description:string){
        this.ServiceId = serviceId;
        this.Date = date;
        this.Description = description;
    }
}

export class AlterStateAppointmentRequest{
    AppointmentId:string;
    Status:number;

    constructor(appointmentId:string,status:number){
        this.AppointmentId = appointmentId;
        this.Status = status;
    }
}