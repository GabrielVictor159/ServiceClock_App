export type EnvironmentType = {
    apiUrl: string;
}

export class Environment implements EnvironmentType {
    apiUrl: string;
    imageContainer: string;

    constructor() {
        this.apiUrl = 'https://gabrielvpb.com.br/serviceclock/api/';
        this.imageContainer = 'https://serviceclock.blob.core.windows.net/serviceclockimages/';
    }
}