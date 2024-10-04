import Toast from "react-native-toast-message";

export class OtherServices {
    public async GetCountrys(): Promise<[string, string]> 
    {
        try {
            
        } catch (error:any) {
            Toast.show({
                type: 'error',
                text1: error.response.data,
                text2: 'Houve um erro ao buscar os países'
              });
        }
    }
    
}