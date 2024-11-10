import axios from "axios";
import { Environment, EnvironmentType } from "../Environment";
import Toast from "react-native-toast-message";
import { AuthenticationItem, useAuthentication } from "../provider/AuthenticationProvider";
import { ServiceCore } from "./ServiceCore";
import { PageSize } from "./PageSize";

export class MessageService extends ServiceCore {
    environment: EnvironmentType;
    constructor() {
        super();
        this.environment = new Environment();
    }

    public async CreateMessage(data: CreateMessageRequest,authenticationItem:AuthenticationItem, setIsLoading?:(loading: boolean)=>void): Promise<[any, boolean]> {
        try {
            setIsLoading?.(true);
            var response = await axios.post(`${this.environment.apiUrl}CreateMessage`,data,{
                headers:{
                    Authorization: `Bearer ${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            this.ShowError(error);
            return [error.response.data, false];
        } finally {
            setIsLoading?.(false);
        }
    }

    public async DeleteMessage(data: DeleteMessageRequest,authenticationItem:AuthenticationItem, setIsLoading?:(loading: boolean)=>void): Promise<[any, boolean]> {
        try {
            setIsLoading?.(true);
            var response = await axios.post(`${this.environment.apiUrl}DeleteMessage`,data,{
                headers:{
                    Authorization: `Bearer ${authenticationItem!.Token}`,
                    'Content-Type': 'application/json'
                }
            });
            return [response.data, true];
        } catch (error: any) {
            this.ShowError(error);
            return [error.response.data, false];
        } finally {
            setIsLoading?.(false);
        }
    }

}

export enum MessageType {
    Txt = 1,
    Img = 2,
    Video = 3,
    Audio = 4,
    File = 5
}

export class CreateMessageRequest {
    type: MessageType;
    clientId?: string;  
    companyId?: string; 
    content: string = "";
    fileName: string = "";

    constructor(
        type: MessageType,
        clientId?: string,
        companyId?: string,
        content: string = "",
        fileName: string = ""
    ) {
        this.type = type;
        this.clientId = clientId;
        this.companyId = companyId;
        this.content = content;
        this.fileName = fileName;
    }
}

export class DeleteMessageRequest {
    messageId: string;

    constructor(messageId: string) {
        this.messageId = messageId;
    }
}

export class ListMessageRequest {
    clientId?: string;
    companyId?: string;
    minDate?: Date;

    constructor(clientId?: string, companyId?: string, minDate?: Date) {
        this.clientId = clientId;
        this.companyId = companyId;
        this.minDate = minDate;
    }
}

