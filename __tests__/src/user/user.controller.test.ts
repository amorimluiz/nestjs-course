import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../src/user/user.controller';
import { UserService } from '../../../src/user/user.service';
import { UserServiceMock } from '../../providers/user-service.mock';
import { AuthGuard } from '../../../src/guards/auth.guard';
import { RoleGuard } from '../../../src/guards/role.guard';
import { Role } from '../../../src/enums/role.enum';

describe('user service suite', () => {
    let userController: UserController;
    let userService: UserService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserServiceMock]
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(RoleGuard)
            .useValue({ canActivate: () => true })
            .compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });

    it('should return all users', async () => {
        // Act
        await userController.getUsers();

        // Assert 
        expect(userService.list).toHaveBeenCalled();
    });

    it('should return a user by id', async () => {
        // Arrange
        const id = 1;

        // Act
        await userController.getUserById(id);

        // Assert 
        expect(userService.findById).toHaveBeenCalledWith(id);
    });


    it('should create a user', async () => {
        // Arrange
        const data = {
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
            role: 0,
            birthdate: '1990-01-01'
        };

        // Act
        await userController.createUser(data);

        // Assert
        expect(userService.create).toHaveBeenCalledWith(data);
    });

    it('should update a user', async () => {
        // Arrange
        const id = 1;
        const data = {
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
            role: Role.USER,
            birthdate: '1990-01-01'
        };

        // Act
        await userController.updateUser(id, data);

        // Assert
        expect(userService.update).toHaveBeenCalledWith(id, data);
    });

    it('should update a user partially', async () => {
        // Arrange
        const id = 1;
        const data = {
            role: Role.ADMIN
        };

        // Act
        await userController.updatePartialUser(id, data);

        // Assert
        expect(userService.update).toHaveBeenCalledWith(id, data);
    });

    it('should delete a user', async () => {
        // Arrange
        const id = 1;

        // Act
        await userController.deleteUser(id);

        // Assert
        expect(userService.delete).toHaveBeenCalledWith(id);
    });
});
