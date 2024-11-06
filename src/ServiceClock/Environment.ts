export type EnvironmentType = {
    apiUrl: string;
}

export class Environment implements EnvironmentType {
    apiUrl: string;
    imageContainer: string;

    constructor() {
        this.apiUrl = 'https://5c69-186-212-195-195.ngrok-free.app/api/';
        this.imageContainer = 'https://serviceclock.blob.core.windows.net/serviceclockimages/';
    }
}