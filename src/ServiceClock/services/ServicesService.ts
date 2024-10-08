import axios from "axios";
import { Environment, EnvironmentType } from "../Environment";
import { useAuthentication } from "../provider/AuthenticationProvider";

export class ServicesService {
    environment: EnvironmentType;
    constructor() {
        this.environment = new Environment();
    }
    public async GetServices(data:GetServiceRequest): Promise<[any, boolean]> {
        let {authenticationItem,setAuthenticationItem} = useAuthentication();
        try {
            var response = await axios.post(`${this.environment.apiUrl}ListService`,data,{
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
    public async DeleteService(data:DeleteServiceRequest): Promise<[any, boolean]> {
        let {authenticationItem,setAuthenticationItem} = useAuthentication();
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
    public async CreateService(data:CreateServiceRequest): Promise<[any, boolean]> {
        let {authenticationItem,setAuthenticationItem} = useAuthentication();
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
    SizePage?:number;
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