export type EnvironmentType = {
    apiUrl: string;
}

export class Environment implements EnvironmentType {
    apiUrl: string;
    imageContainer: string;

    constructor() {
        this.apiUrl = 'https://serviceclockback.azurewebsites.net/api/';
        this.imageContainer = 'https://serviceclock.blob.core.windows.net/serviceclockimages/';
    }
}