import axios from "axios";
import { Environment, EnvironmentType } from "../Environment";
import Toast from "react-native-toast-message";
import { useAuthentication } from "../provider/AuthenticationProvider";
import { ServiceCore } from "./ServiceCore";

export class CompanyService extends ServiceCore {
    environment: EnvironmentType;
    constructor() {
        super();
        this.environment = new Environment();
    }
    public async RegisterCompany(data: any): Promise<[any, boolean]> {
        try {
            console.log(data);
            var response = await axios.post(`${this.environment.apiUrl}CreateCompany`,
                data
            );
            return [response.data, true];
        } catch (error: any) {
            this.ShowError(error);
            return [error.response.data, false];
        }
    }
}