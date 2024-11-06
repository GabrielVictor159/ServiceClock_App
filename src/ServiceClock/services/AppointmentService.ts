import axios from "axios";
import { Environment, EnvironmentType } from "../Environment";
import { AuthenticationItem } from "../provider/AuthenticationProvider";
import Toast from "react-native-toast-message";
import { ServiceCore } from "./ServiceCore";

export class AppointmentService extends ServiceCore {
    environment: EnvironmentType;
    constructor() {
        super();
        this.environment = new Environment();
    }

    public async ListAppointments(data:ListAppointmentRequest,authenticationItem:AuthenticationItem, setIsLoading?:(loading: boolean)=>void): Promise<[any, boolean]> {
        try {
            setIsLoading?.(true);
            var response = await axios.post(`${this.environment.apiUrl}ListAppointment`,data,{
                headers:{
                    Authorization: `Bearer ${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            this.ShowError(error);
            return [error, false];
        } finally {
            setIsLoading?.(false);
        }
    }

    public async RequestAppointment(data:RequestAppointmentRequest,authenticationItem:AuthenticationItem, setIsLoading?:(loading: boolean)=>void): Promise<[any, boolean]> {
        try {
            setIsLoading?.(true);
            var response = await axios.post(`${this.environment.apiUrl}RequestAppointment`,data,{
                headers:{
                    Authorization: `Bearer ${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            this.ShowError(error);
            return [error, false];
        } finally {
            setIsLoading?.(false);
        }
    }

    public async AlterStateAppointment(data:AlterStateAppointmentRequest,authenticationItem:AuthenticationItem, setIsLoading?:(loading: boolean)=>void): Promise<[any, boolean]> {
        try {
            setIsLoading?.(true);
            var response = await axios.post(`${this.environment.apiUrl}AlterStateAppointment`,data,{
                headers:{
                    Authorization: `Bearer ${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            this.ShowError(error);
            return [error, false];
        } finally {
            setIsLoading?.(false);
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