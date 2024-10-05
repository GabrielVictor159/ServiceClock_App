import { AuthenticationService } from "./AuthenticationService";
import { CompanyService } from "./CompanyService";
import { OtherServices } from "./OtherServices";

export class ServiceFactory {
    static createService(serviceType: ServiceType): AuthenticationService | OtherServices | CompanyService {
        if (serviceType === ServiceType.Authentication) {
            return new AuthenticationService();
        }
        if(serviceType === ServiceType.Other){
            return new OtherServices();
        }
        if(serviceType === ServiceType.Company){
            return new CompanyService();
        }
        throw new Error(`Serviço do tipo ${serviceType} não foi implementado.`);
    }
}


export enum ServiceType {
    Authentication = "Authentication",
    Company = "Company",
    Other = "Other"
}