import { AppointmentService } from "./AppointmentService";
import { AuthenticationService } from "./AuthenticationService";
import { ClientService } from "./ClientService";
import { CompanyService } from "./CompanyService";
import { OtherServices } from "./OtherServices";
import { ServicesService } from "./ServicesService";

export class ServiceFactory {
    static createService(serviceType: ServiceType): 
    AuthenticationService | AppointmentService | OtherServices | CompanyService | ServicesService | CompanyService | ClientService {
        if (serviceType === ServiceType.Authentication) {
            return new AuthenticationService();
        }
        if(serviceType === ServiceType.Appointment){
            return new AppointmentService();
        }
        if(serviceType === ServiceType.Other){
            return new OtherServices();
        }
        if(serviceType === ServiceType.Company){
            return new CompanyService();
        }
        if(serviceType === ServiceType.Services){
            return new ServicesService();
        }
        if(serviceType === ServiceType.Client){
            return new ClientService();
        }
        throw new Error(`Serviço do tipo ${serviceType} não foi implementado.`);
    }
}


export enum ServiceType {
    Authentication = "Authentication",
    Appointment = "Appointment",
    Company = "Company",
    Client = "Client",
    Services = "Services",
    Other = "Other"
}