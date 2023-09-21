import { Provider } from "@nestjs/common";
import { REPOSITORIES } from "../../../config/constants";
import { fileRepositoryMock } from "./fileRepositoryMock";

export const fileProvider: Provider = {
    provide: REPOSITORIES.FILE,
    useValue: fileRepositoryMock,
}