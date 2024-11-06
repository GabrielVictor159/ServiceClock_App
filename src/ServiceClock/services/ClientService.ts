import axios from "axios";
import { Environment, EnvironmentType } from "../Environment";
import Toast from "react-native-toast-message";
import { AuthenticationItem, useAuthentication } from "../provider/AuthenticationProvider";
import { ServiceCore } from "./ServiceCore";
import { PageSize } from "./PageSize";

export class ClientService extends ServiceCore {
    environment: EnvironmentType;
    constructor() {
        super();
        this.environment = new Environment();
    }

    public async GetClientById(Id:string,authenticationItem:AuthenticationItem, setIsLoading?:(loading: boolean)=>void): Promise<[any, boolean]> {
        try {
            setIsLoading?.(true);
            var response = await axios.get(`${this.environment.apiUrl}GetClient/${Id}`,{
                headers:{
                    Authorization: `Bearer ${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            this.ShowError(error);
            return [error.response.data, false];
        } finally {
            setIsLoading?.(false);
        }
    }

    public async GetClient(request:GetClientRequest,authenticationItem:AuthenticationItem, setIsLoading?:(loading: boolean)=>void): Promise<[any, boolean]> {
        try {
            setIsLoading?.(true);
            var response = await axios.post(`${this.environment.apiUrl}GetClient`,request,{
                headers:{
                    Authorization: `Bearer ${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            this.ShowError(error);
            return [error.response.data, false];
        } finally {
            setIsLoading?.(false);
        }
    }

    public async CreateClient(request:CreateClientRequest,authenticationItem:AuthenticationItem, setIsLoading?:(loading: boolean)=>void): Promise<[any, boolean]> {
        try {
            setIsLoading?.(true);
            var response = await axios.post(`${this.environment.apiUrl}CreateClient`,request,{
                headers:{
                    Authorization: `Bearer ${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            this.ShowError(error);
            return [error.response.data, false];
        } finally {
            setIsLoading?.(false);
        }
    }

    public async UpdateClient(request:PatchClientRequest,authenticationItem:AuthenticationItem, setIsLoading?:(loading: boolean)=>void): Promise<[any, boolean]> {
        try {
            setIsLoading?.(true);
            var response = await axios.patch(`${this.environment.apiUrl}PatchClient`,request,{
                headers:{
                    Authorization: `Bearer ${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            this.ShowError(error);
            return [error.response.data, false];
        } finally {
            setIsLoading?.(false);
        }
    }

    public async DeleteClient(idClient:string,authenticationItem:AuthenticationItem, setIsLoading?:(loading: boolean)=>void): Promise<[any, boolean]> {
        try {
            setIsLoading?.(true);
            var response = await axios.post(`${this.environment.apiUrl}DeleteClient`,{ClientId:idClient},{
                headers:{
                    Authorization: `Bearer ${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            this.ShowError(error);
            return [error.response.data, false];
        } finally {
            setIsLoading?.(false);
        }
    }

}

export class GetClientRequest {
    id?: string;
    name?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    indexPage?: number;
    pageSize?: PageSize;
}

export class CreateClientRequest {
    name!: string;
    password!: string;
    email!: string;
    phoneNumber!: string;
    address!: string;
    city!: string;
    state!: string;
    country!: string;
    postalCode!: string;
    birthDate!: Date;
}

export class PatchClientRequest {
    name?: string;
    password?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    image?: string;
    imageName?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    birthDate?: Date;
}



