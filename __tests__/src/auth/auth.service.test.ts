import { AuthService } from "../../../src/auth/auth.service";
import { User } from "../../../src/user/entity/user.entity";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { UserRepositoryMock } from "../../providers/user-repository.mock";
import { JwtServiceMock } from "../../providers/jwt-service.mock";
import { UserServiceMock } from "../../providers/user-service.mock";
import { MailerServiceMock } from "../../providers/mailer-service.mock";
import { UserService } from "../../../src/user/user.service";
import { MailerService } from "@nestjs-modules/mailer";
import { Role } from "../../../src/enums/role.enum";
import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';
import { AuthRegisterDTO } from "../../../src/auth/dto/auth-register.dto";

jest.mock('bcrypt');

describe('AuthService', () => {
    let authService: AuthService;
    let jwtService: JwtService;
    let userService: UserService;
    let mailerService: MailerService;
    let userRepository: Repository<User>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                AuthService,
                UserRepositoryMock,
                JwtServiceMock,
                UserServiceMock,
                MailerServiceMock
            ]
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        userService = module.get<UserService>(UserService);
        mailerService = module.get<MailerService>(MailerService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should generate a token', async () => {
        // Arrange
        const user = new User();
        user.id = 1;
        user.role = Role.USER;

        // Act
        const token = await authService.generateToken(user);

        // Assert
        expect(jwtService.sign).toHaveBeenCalled();
        expect(token.accessToken).toBe('mockedToken');
    });

    it('should validate a token', async () => {
        // Arrange
        const token = 'validToken';

        // Act
        const result = authService.validateToken(token);

        // Assert
        expect(jwtService.verify).toHaveBeenCalledWith(token);
        expect(jwtService.verify).toHaveReturnedWith(result);
    });

    it('should not validate an invalid token', async () => {
        // Arrange
        const token = 'invalidToken';

        // Act & Assert
        expect(() => authService.validateToken(token)).toThrow(UnauthorizedException);
    });

    it('should check if a token is valid', async () => {
        // Arrange
        const token = 'validToken';

        // Act
        const result = authService.isValidToken(token);

        // Assert
        expect(jwtService.verify).toHaveBeenCalledWith(token);
        expect(result).toBe(true);
    });

    it('should check if a token is invalid', async () => {
        // Arrange
        const token = 'invalidToken';

        // Act
        const result = authService.isValidToken(token);

        // Assert
        expect(jwtService.verify).toHaveBeenCalledWith(token);
        expect(result).toBe(false);
    });

    it('should login', async () => {
        // Arrange
        const user = userRepository.find()[0];
        const email = user.email;
        const password = '123456';

        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        // Act
        const token = await authService.login(email, password);

        // Assert
        expect(userRepository.findOneBy).toHaveBeenCalledWith({email});
        expect(bcrypt.compare).toHaveBeenCalled();
        expect(token).toEqual({accessToken: 'mockedToken'});
    });

    it('should not login with invalid credentials', async () => {
        // Arrange
        const user = userRepository.find()[0];
        const email = user.email;
        const password = '123456';

        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        // Act & Assert
        await expect(authService.login(email, password)).rejects.toThrow(UnauthorizedException);
        expect(userRepository.findOneBy).toHaveBeenCalledWith({email});
        expect(bcrypt.compare).toHaveBeenCalled();
    });

    it('should not login with invalid email', async () => {
        //Arrange
        const email = 'notfound@test.com';
        const password = '123456';

        // Act & Assert
        await expect(authService.login(email, password)).rejects.toThrow(UnauthorizedException);
        expect(userRepository.findOneBy).toHaveBeenCalledWith({email});
    })

    it('should forget password', async () => {
        // Arrange
        const user = userRepository.find()[0];
        const email = user.email;

        jest.spyOn(authService, 'generateToken').mockImplementation(async user => ({accessToken: 'mockedToken'}));

        // Act
        const result = await authService.forget(email);

        // Assert
        expect(userRepository.findOneBy).toHaveBeenCalledWith({email});
        expect(authService.generateToken).toHaveBeenCalledWith(user);
        expect(mailerService.sendMail).toHaveBeenCalled();
        expect(result).toBeTruthy();
    });

    it('should not forget password with invalid email', async () => {
        // Arrange
        const email = 'notfound@test.com';

        // Act & Assert
        await expect(authService.forget(email)).rejects.toThrow(NotFoundException);
        expect(userRepository.findOneBy).toHaveBeenCalledWith({email});
    });

    it('should reset password', async () => {
        // Arrange
        const token = 'validToken';
        const password = '123456';

        jest.spyOn(authService, 'validateToken').mockReturnValue({sub: '1'});
        jest.spyOn(authService, 'generateToken').mockResolvedValue({accessToken: 'mockedToken'});

        // Act
        const result = await authService.reset(password, token);

        // Assert
        expect(authService.validateToken).toHaveBeenCalledWith(token);
        expect(userService.update).toHaveBeenCalledWith(1, {password});
        expect(result).toEqual({accessToken: 'mockedToken'});
    });

    it('should not reset password with invalid token', async () => {
        // Arrange
        const token = 'invalidToken';
        const password = '123456';

        jest.spyOn(authService, 'validateToken').mockImplementation(() => {
            throw new UnauthorizedException();
        });

        // Act & Assert
        await expect(authService.reset(password, token)).rejects.toThrow(UnauthorizedException);
        expect(authService.validateToken).toHaveBeenCalledWith(token);
    });

    it('should not reset password with invalid subject', async () => {
        // Arrange
        const token = 'validToken';
        const password = '123456';

        jest.spyOn(authService, 'validateToken').mockReturnValue({sub: 'invalid'});

        // Act & Assert
        await expect(authService.reset(password, token)).rejects.toThrow(BadRequestException);
        expect(authService.validateToken).toHaveBeenCalledWith(token);
    });
    
    it('should register a new user', async () => {
        // Arrange
        const data: AuthRegisterDTO = {
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: '123456',
            birthdate: '1990-01-01',
            role: Role.USER,
        };

        jest.spyOn(authService, 'generateToken').mockResolvedValue({accessToken: 'mockedToken'});

        // Act
        const result = await authService.register(data);

        // Assert
        expect(userService.create).toHaveBeenCalledWith(data);
        expect(result).toEqual({accessToken: 'mockedToken'});
    });
});
