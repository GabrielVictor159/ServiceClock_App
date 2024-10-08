import { AuthenticationService } from "./AuthenticationService";
import { CompanyService } from "./CompanyService";
import { OtherServices } from "./OtherServices";
import { ServicesService } from "./ServicesService";

export class ServiceFactory {
    static createService(serviceType: ServiceType): 
    AuthenticationService | OtherServices | CompanyService | ServicesService {
        if (serviceType === ServiceType.Authentication) {
            return new AuthenticationService();
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
        throw new Error(`Serviço do tipo ${serviceType} não foi implementado.`);
    }
}


export enum ServiceType {
    Authentication = "Authentication",
    Company = "Company",
    Services = "Services",
    Other = "Other"
}