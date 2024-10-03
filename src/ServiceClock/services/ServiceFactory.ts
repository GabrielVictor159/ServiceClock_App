import { AuthenticationService } from "./AuthenticationService";

export class ServiceFactory {
    static createService(serviceType: ServiceType) {
        if (serviceType === ServiceType.Authentication) {
            return new AuthenticationService();
        }
        throw new Error(`Serviço do tipo ${serviceType} não foi implementado.`);
    }
}


export enum ServiceType {
    Authentication = "Authentication",
}