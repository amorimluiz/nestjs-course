import { Provider } from "@nestjs/common";
import { UserService } from "../../src/user/user.service";

const list = jest.fn();

const findById = jest.fn();

const update = jest.fn();

const create = jest.fn();

const deleteFn = jest.fn();

export const UserServiceMock: Provider = {
    provide: UserService,
    useValue: {
        update,
        create,
        list,
        findById,
        delete: deleteFn,
    }
};