import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../src/user/entity/user.entity';
import { UserService } from '../../../src/user/user.service';
import { CreateUserDTO } from '../../../src/user/dto/create-user.dto';
import { Role } from '../../../src/enums/role.enum';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateUserDTO } from '../../../src/user/dto/update-put-user.dto';
import { UserRepositoryMock } from '../../providers/user-repository.mock';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('user service suite', () => {
    let userService: UserService;
    let userRepository: Repository<User>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                UserRepositoryMock
            ]
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should create an user', async () => {
        // Arrange
        const data: CreateUserDTO = {
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
            birthdate: '1990-01-01',
            role: Role.USER,
        };

        userRepository.existsBy = jest.fn().mockResolvedValue(false);
        
        // Act
        const user = await userService.create(data);

        // Assert
        expect(user).toBeInstanceOf(User);
        expect(userRepository.existsBy).toHaveBeenCalledWith({ email: data.email });
        expect(userRepository.create).toHaveBeenCalled();
        expect(userRepository.save).toHaveBeenCalled();
        expect(bcrypt.hash).toHaveBeenCalledWith(data.password, 'mockedSalt');
    });

    it('should throw an error if email already exists', async () => {
        // Arrange
        const data: CreateUserDTO = {
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
            birthdate: '1990-01-01',
            role: Role.USER,
        };

        userRepository.existsBy = jest.fn().mockResolvedValue(true);

        // Act & Assert
        await expect(userService.create(data)).rejects.toThrow(BadRequestException);
        expect(userRepository.existsBy).toHaveBeenCalledWith({ email: data.email });
        expect(userRepository.create).not.toHaveBeenCalled();
        expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should list all users', async () => {
        // Act
        const users = await userService.list();

        // Assert
        expect(userRepository.find).toHaveBeenCalled();
        expect(users.every(user => user instanceof User)).toBeTruthy(); 
    });

    it('should find an user by id', async () => {
        // Arrange
        const id = 1;

        // Act
        const foundUser = await userService.findById(id);

        // Assert
        expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: id });
        expect(foundUser).toBeInstanceOf(User);
    });

    it('should update an user', async () => {
        // Arrange
        const id = 1;
        const data: UpdateUserDTO = {
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
            birthdate: '1990-01-01',
            role: Role.USER,
        };

        // Act
        const updatedUser = await userService.update(id, data);

        // Assert
        expect(updatedUser).toBeInstanceOf(User);
        expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: id });
        expect(userRepository.update).toHaveBeenCalled();
        expect(userRepository.save).toHaveBeenCalled();
        expect(bcrypt.hash).toHaveBeenCalledWith(data.password, 'mockedSalt');
    });

    it('should throw an error if user to update does not exist', async () => {
        // Arrange
        const id = 999;
        const data: UpdateUserDTO = {
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
            birthdate: '1990-01-01',
            role: Role.USER,
        };

        // Act & Assert
        await expect(userService.update(id, data)).rejects.toThrow(NotFoundException);
        expect(userRepository.findOneBy).toHaveBeenCalledWith({ id });
    });

    it('should delete an user', async () => {
        // Arrange
        const id = 1;

        userRepository.existsBy = jest.fn().mockResolvedValue(true);

        // Act
        const deletedUser = await userService.delete(id);

        // Assert
        expect(userRepository.delete).toHaveBeenCalledWith(id);
        expect(deletedUser).toBeInstanceOf(User);
    });

    it('should throw an error if user to delete does not exist', async () => {
        // Arrange
        const id = 999;

        userRepository.existsBy = jest.fn().mockResolvedValue(false);

        // Act & Assert
        await expect(userService.delete(id)).rejects.toThrow(NotFoundException);
        expect(userRepository.existsBy).toHaveBeenCalledWith({ id });
    });
});
