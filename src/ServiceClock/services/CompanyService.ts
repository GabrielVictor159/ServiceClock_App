import axios from "axios";
import { Environment, EnvironmentType } from "../Environment";
import Toast from "react-native-toast-message";
import { AuthenticationItem, useAuthentication } from "../provider/AuthenticationProvider";
import { ServiceCore } from "./ServiceCore";
import { PageSize } from "./PageSize";

export class CompanyService extends ServiceCore {
    environment: EnvironmentType;
    constructor() {
        super();
        this.environment = new Environment();
    }

    public async GetCompanyById(Id:string,authenticationItem:AuthenticationItem): Promise<[any, boolean]> {
        try {
            var response = await axios.get(`${this.environment.apiUrl}GetCompany/${Id}`,{
                headers:{
                    Authorization: `${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            this.ShowError(error);
            return [error.response.data, false];
        }
    }

    public async GetCompany(data: GetCompanyRequest,authenticationItem:AuthenticationItem): Promise<[any, boolean]> {
        try {
            var response = await axios.post(`${this.environment.apiUrl}GetCompany`,data,{
                headers:{
                    Authorization: `${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            this.ShowError(error);
            return [error.response.data, false];
        }
    }

    public async RegisterCompany(data: any): Promise<[any, boolean]> {
        try {
            var response = await axios.post(`${this.environment.apiUrl}CreateCompany`,
                data
            );
            return [response.data, true];
        } catch (error: any) {
            this.ShowError(error);
            return [error.response.data, false];
        }
    }

    public async PatchCompany(data:PatchCompanyRequest | any,authenticationItem:AuthenticationItem): Promise<[any, boolean]>{
        try {
            var response = await axios.patch(`${this.environment.apiUrl}PatchCompany`,data,{
                headers:{
                    Authorization: `${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            this.ShowError(error);
            return [error.response.data, false];
        }
    }
}

export class GetCompanyRequest {
    Id: string = "";
    Name: string = "";
    RegistrationNumber: string = "";
    Address: string = "";
    City: string = "";
    State: string = "";
    Country: string = "";
    PostalCode: string = "";
    PhoneNumber: string = "";
    Email: string = "";
    IndexPage: number = 1;
    PageSize: PageSize = PageSize.Minimal;
}

export class PatchCompanyRequest {
    name: string | undefined;
    password: string | undefined;
    registrationNumber: string | undefined;
    address: string | undefined;
    image: string | undefined;
    imageName: string | undefined;
    city: string | undefined;
    state: string | undefined;
    postalCode: string | undefined;
    phoneNumber: string | undefined;
}
