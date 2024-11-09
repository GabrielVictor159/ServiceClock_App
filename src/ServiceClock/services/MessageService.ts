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

}

export enum MessageType {
    Txt = 1,
    Img = 2,
    Video = 3,
    Audio = 4,
    File = 5
}

