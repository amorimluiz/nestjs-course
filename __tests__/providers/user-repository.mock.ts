import { Provider } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../../src/user/entity/user.entity";
import { UserFactory } from "../factories/user.factory";
import { DeepPartial, FindOptionsWhere } from "typeorm";

const mockUsers = UserFactory.createMany(30);

const existsBy = jest.fn().mockImplementation(async (filter: FindOptionsWhere<User>) => mockUsers.some(user => Object.keys(filter).every(key => user[key] === filter[key])));

const create = jest.fn().mockResolvedValue(new User());

const save = jest.fn().mockImplementation(async (user: DeepPartial<User>) => {
    const currentUser = mockUsers.find(u => u.id === user.id) ?? new User();

    for (const key in user) {
        currentUser[key] = user[key];
    }

    if (!currentUser.id) {
        currentUser.id = mockUsers[mockUsers.length - 1].id + 1;
        currentUser.createdAt = new Date();
        currentUser.updatedAt = new Date();
        mockUsers.push(currentUser);
    }
    
    return currentUser;
});

const find = jest.fn().mockReturnValue(mockUsers);

const findOneBy = jest.fn().mockImplementation(async (filter: FindOptionsWhere<User>) => mockUsers.find(user => Object.keys(filter).every(key => user[key] === filter[key])));

const update = jest.fn();
const deleteFn = jest.fn();

export const UserRepositoryMock: Provider = {
    provide: getRepositoryToken(User),
    useValue: {
        existsBy,
        create,
        save,
        find,
        findOneBy,
        update,
        delete: deleteFn,
    }
};