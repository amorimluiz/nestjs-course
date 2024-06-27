import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../../../src/guards/auth.guard';
import { AuthController } from '../../../src/auth/auth.controller';
import { AuthService } from '../../../src/auth/auth.service';
import { AuthServiceMock } from '../../providers/auth-service.mock';
import { Role } from '../../../src/enums/role.enum';
import { FileService } from '../../../src/file/file.service';
import { FileServiceMock } from '../../providers/file-service.mock';

describe('user service suite', () => {
    let authController: AuthController;
    let authService: AuthService;
    let fileService: FileService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthServiceMock, FileServiceMock]
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        fileService = module.get<FileService>(FileService);
    });

    it('should login', async () => {
        // Arrange
        const data = {
            email: 'johndoe@test.com',
            password: '123456'
        };

        // Act
        await authController.login(data);

        // Assert
        expect(authService.login).toHaveBeenCalledWith(data.email, data.password);
    });

    it('should register', async () => {
        // Arrange
        const data = {
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
            role: Role.USER,
            birthdate: '1990-01-01'
        };

        // Act
        await authController.register(data);

        // Assert
        expect(authService.register).toHaveBeenCalledWith(data);
    });

    it('should forget', async () => {
        // Arrange
        const data = {
            email: 'johndoe@test.com',
        };

        // Act
        await authController.forget(data);


        // Assert
        expect(authService.forget).toHaveBeenCalledWith(data.email);
    });

    it('should reset', async () => {
        // Arrange
        const data = {
            password: '123456',
            token: 'token'
        };

        // Act
        await authController.reset(data);

        // Assert
        expect(authService.reset).toHaveBeenCalledWith(data.password, data.token);
    });

    
    it('should upload photo', async () => {
        // Arrange
        const file = {
            originalname: 'test.jpg',
            mimetype: 'image/jpeg',
            size: 1024 * 200,
            buffer: Buffer.from('test image data')
        };

        // Act
        await authController.uploadPhoto(file as Express.Multer.File);

        // Assert
        expect(fileService.upload).toHaveBeenCalledWith(file, expect.any(String));
    });

    it('should throw error on upload photo', async () => {
        // Arrange
        const file = {
            originalname: 'test.jpg',
            mimetype: 'image/jpeg',
            size: 1024 * 200,
            buffer: Buffer.from('test image data')
        };

        const errorMessage = 'Error message';

        fileService.upload = jest.fn().mockRejectedValue(new Error(errorMessage));

        // Act & Assert
        await expect(authController.uploadPhoto(file as Express.Multer.File)).rejects.toThrow(errorMessage);
    });
});
