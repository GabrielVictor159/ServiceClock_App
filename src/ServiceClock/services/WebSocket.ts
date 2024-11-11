export class WebSocketBody {
    target: string;
    arguments?: any;
    Authorization: string;

    constructor(target: string, Authorization: string, argument?: any) {
        this.target = target;
        this.Authorization = Authorization;
        this.arguments = argument;
    }
}