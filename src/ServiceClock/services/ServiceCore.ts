import Toast from "react-native-toast-message";

export class ServiceCore{
    protected ShowError = (error:any) => {
        console.log(error);
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
                text2: 'Houve um erro ao tentar acessar o serviço'
            });
        }
    }
}