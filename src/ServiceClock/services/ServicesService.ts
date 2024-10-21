import axios from "axios";
import { Environment, EnvironmentType } from "../Environment";
import { useAuthentication, AuthenticationItem } from '../provider/AuthenticationProvider';

export class ServicesService {
    environment: EnvironmentType;
    constructor() {
        this.environment = new Environment();
    }
    public async GetServices(data:GetServiceRequest,authenticationItem:AuthenticationItem): Promise<[any, boolean]> {
        try {
            var response = await axios.post(`${this.environment.apiUrl}ListService`,data,{
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
    public async DeleteService(data:DeleteServiceRequest,authenticationItem:AuthenticationItem): Promise<[any, boolean]> {
        try {
            var response = await axios.post(`${this.environment.apiUrl}DeleteService`,data,{
                headers:{
                    Authorization: `${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            return [error, false];
        }
    }
    public async CreateService(data:CreateServiceRequest, authenticationItem:AuthenticationItem): Promise<[any, boolean]> {
        try {
            var response = await axios.post(`${this.environment.apiUrl}CreateService`,data,{
                headers:{
                    Authorization: `${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            return [error, false];
        }
    }

}

export class GetServiceRequest{
    Id?:string;
    Name?:string;
    Description?:string;
    Address?:string;
    City?:string;
    State?:string;
    Country?:string;
    PostalCode?:string;
    IndexPage?:number;
    PageSize?:number;
    
}

export class DeleteServiceRequest{
    ServiceId:string;
    constructor(serviceId:string){
        this.ServiceId = serviceId;
    }
}

export class CreateServiceRequest{
    Name:string;
    Description:string;
    Address:string;
    City:string;
    State:string;
    Country:string;
    PostalCode:string;
    constructor(name:string,description:string,address:string,city:string,state:string,country:string,postalCode:string){
        this.Name = name;
        this.Description = description;
        this.Address = address;
        this.City = city;
        this.State = state;
        this.Country = country;
        this.PostalCode = postalCode;
    }
}