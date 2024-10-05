import axios from "axios";
import { Environment, EnvironmentType } from "../Environment";
import Toast from "react-native-toast-message";
import { useAuthentication } from "../provider/AuthenticationProvider";

export class CompanyService {
    environment: EnvironmentType;
    constructor() {
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
            if (Array.isArray(error.response.data)) {
                error.response.data.forEach((element: any) => {
                    Toast.show({
                        type: 'error',
                        text1: 'Campos invalidos',
                        text2: element.Message
                    });
                });
            }
            else {
                Toast.show({
                    type: 'error',
                    text1: error.response.data,
                    text2: 'Houve um erro ao registrar a empresa'
                });
            }
            return [error.response.data, false];
        }
    }
}