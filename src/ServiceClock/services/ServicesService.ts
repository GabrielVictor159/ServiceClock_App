import axios from "axios";
import { Environment, EnvironmentType } from "../Environment";
import { useAuthentication, AuthenticationItem } from '../provider/AuthenticationProvider';
import { ServiceCore } from "./ServiceCore";

export class ServicesService extends ServiceCore {
    environment: EnvironmentType;
    constructor() {
        super();
        this.environment = new Environment();
    }
    public async GetServices(data: GetServiceRequest, authenticationItem: AuthenticationItem, setIsLoading?:(loading: boolean)=>void): Promise<[any, boolean]> {
        try {
            setIsLoading?.(true);
            var response = await axios.post(`${this.environment.apiUrl}ListService`, data, {
                headers: {
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
    public async DeleteService(data: DeleteServiceRequest, authenticationItem: AuthenticationItem, setIsLoading?:(loading: boolean)=>void): Promise<[any, boolean]> {
        try {
            setIsLoading?.(true);
            var response = await axios.post(`${this.environment.apiUrl}DeleteService`, data, {
                headers: {
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
    public async CreateService(data: CreateServiceRequest, authenticationItem: AuthenticationItem, setIsLoading?:(loading: boolean)=>void): Promise<[any, boolean]> {
        try {
            setIsLoading?.(true);
            var response = await axios.post(`${this.environment.apiUrl}CreateService`, data, {
                headers: {
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
    public async EditService(data: EditServiceRequest, authenticationItem: AuthenticationItem, setIsLoading?:(loading: boolean)=>void): Promise<[any, boolean]> {
        try {
            setIsLoading?.(true);
            var response = await axios.patch(`${this.environment.apiUrl}EditService`, data, {
                headers: {
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

export class GetServiceRequest {
    Id?: string;
    Name?: string;
    Description?: string;
    Address?: string;
    City?: string;
    State?: string;
    Country?: string;
    PostalCode?: string;
    IndexPage?: number;
    PageSize?: number;

}

export class DeleteServiceRequest {
    ServiceId: string;
    constructor(serviceId: string) {
        this.ServiceId = serviceId;
    }
}

export class EditServiceRequest {
    Id: string;
    Name?: string;
    Description?: string;
    Address?: string;
    City?: string;
    State?: string;
    Country?: string;
    PostalCode?: string;

    constructor(Id: string) {
        this.Id = Id
    }

}

export class CreateServiceRequest {
    Name: string;
    Description: string;
    Address: string;
    City: string;
    State: string;
    Country: string;
    PostalCode: string;
    constructor(name: string, description: string, address: string, city: string, state: string, country: string, postalCode: string) {
        this.Name = name;
        this.Description = description;
        this.Address = address;
        this.City = city;
        this.State = state;
        this.Country = country;
        this.PostalCode = postalCode;
    }
}