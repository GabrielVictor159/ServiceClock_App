import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Environment, EnvironmentType } from '../Environment';
export class AuthenticationService {
    environment: EnvironmentType;
    constructor() {
        this.environment = new Environment();
    }

    public async Login(email: string, senha: string): Promise<[string, string]> 
    {
        try {
            const response = await axios.post(this.environment.apiUrl + 'LoginCompany', {
                Email: email,
                Password: senha
            });
    
            return [response.data.token, "Company"];
        } catch (error:any) {
            try {
                const response = await axios.post(this.environment.apiUrl + 'LoginClient', {
                    Email: email,
                    Password: senha
                });
    
                return [response.data.token, "Client"];
            } catch (error2: any) {
                Toast.show({
                    type: 'error',
                    text1: error2.response.data,
                    text2: 'Email ou senha incorretos'
                  });
                return [error2.response.data, ""];
            }
        }
    }
    
}