import { AuthenticationService } from "./AuthenticationService";
import { OtherServices } from "./OtherServices";

export class ServiceFactory {
    static createService(serviceType: ServiceType): any{
        if (serviceType === ServiceType.Authentication) {
            return new AuthenticationService();
        }
        if(serviceType === ServiceType.Other){
            return new OtherServices();
        }
        throw new Error(`Serviço do tipo ${serviceType} não foi implementado.`);
    }
}


export enum ServiceType {
    Authentication = "Authentication",
    Other = "Other"
}