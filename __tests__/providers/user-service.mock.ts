import { Provider } from "@nestjs/common";
import { UserService } from "../../src/user/user.service";

const update = jest.fn();

const create = jest.fn();

export const UserServiceMock: Provider = {
    provide: UserService,
    useValue: {
        update,
        create
    }
};