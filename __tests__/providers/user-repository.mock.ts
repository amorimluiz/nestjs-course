import { Provider } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../../src/user/entity/user.entity";
import { UserFactory } from "../factories/user.factory";
import { FindOptionsWhere } from "typeorm";

const mockUsers = UserFactory.createMany(10);

export const UserRepositoryMock: Provider = {
    provide: getRepositoryToken(User),
    useValue: {
        existsBy: jest.fn().mockResolvedValue(true),
        create: jest.fn().mockResolvedValue(new User()),
        save: jest.fn().mockResolvedValue(mockUsers[0]),
        find: jest.fn().mockReturnValue(mockUsers),
        findOneBy: jest.fn().mockImplementation(async ({id}: FindOptionsWhere<User>) => mockUsers.find(user => user.id === id) || null),
        update: jest.fn(),
        delete: jest.fn(),
    }
};