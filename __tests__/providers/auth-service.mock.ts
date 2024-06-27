import { Provider } from "@nestjs/common";
import { AuthService } from "../../src/auth/auth.service";

const generateToken = jest.fn();

const validateToken = jest.fn();

const isValidToken = jest.fn();

const login = jest.fn();

const forget = jest.fn();

const reset = jest.fn();

const register = jest.fn();

export const AuthServiceMock: Provider = {
    provide: AuthService,
    useValue: {
        generateToken,
        validateToken,
        isValidToken,
        login,
        forget,
        reset,
        register
    }
};