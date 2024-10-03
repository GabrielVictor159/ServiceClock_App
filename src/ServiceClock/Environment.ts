export type EnvironmentType = {
    apiUrl: string;
}

export class Environment implements EnvironmentType {
    apiUrl: string;

    constructor() {
        this.apiUrl = 'https://serviceclock.azurewebsites.net/api/';
    }
}