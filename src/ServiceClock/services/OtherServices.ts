import axios from "axios";
import Toast from "react-native-toast-message";
import { ServiceCore } from "./ServiceCore";

export class OtherServices extends ServiceCore {
    geonamesUrl: string = 'https://secure.geonames.org/';
    geonamesUsername: string = 'gabriel159487263';

    public async GetCountrys(): Promise<[any, boolean]> {
        try {
            var response = await axios.get(`${this.geonamesUrl}countryInfoJSON?username=${this.geonamesUsername}`);
            return [response.data.geonames, true];
        } catch (error: any) {
            this.ShowError(error);
            return [error.response.data, false];
        }
    }

    public async GetChildren(GeonameId: string): Promise<[any, boolean]> {
        try {
            var response = await axios.get(`${this.geonamesUrl}childrenJSON?geonameId=${GeonameId}&username=${this.geonamesUsername}`);
            return [response.data.geonames, true];
        } catch (error: any) {
            this.ShowError(error);
            return [error.response.data, false];
        }
    }

}

export interface Country {
    code: string;
    name: string;
    geonameId: string;
}

export interface State {
    code: string;
    name: string;
    geonameId: string;
}

export interface City {
    code: string;
    name: string;
}