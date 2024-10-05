import axios from "axios";
import Toast from "react-native-toast-message";

export class OtherServices {
    geonamesUrl: string = 'https://secure.geonames.org/';
    geonamesUsername: string = 'gabriel159487263';

    public async GetCountrys(): Promise<[any, boolean]> {
        try {
            var response = await axios.get(`${this.geonamesUrl}countryInfoJSON?username=${this.geonamesUsername}`);
            return [response.data.geonames, true];
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error.response.data,
                text2: 'Houve um erro ao buscar os países'
            });
            return [error.response.data, false];
        }
    }

    public async GetChildren(GeonameId: string): Promise<[any, boolean]> {
        try {
            var response = await axios.get(`${this.geonamesUrl}childrenJSON?geonameId=${GeonameId}&username=${this.geonamesUsername}`);
            return [response.data.geonames, true];
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error.response.data,
                text2: 'Houve um erro ao buscar os estados ou cidades'
            });

            return [error.response.data, false];
        }
    }

}