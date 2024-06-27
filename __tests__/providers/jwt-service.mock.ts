import { Provider } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

const sign = jest.fn().mockReturnValue('mockedToken');

const verify = jest.fn().mockImplementation((token: string) => {
    if (token === 'validToken') {
        return {
            role: 'user'
        };
    }

    throw new Error('Invalid token');
});

export const JwtServiceMock: Provider = {
    provide: JwtService,
    useValue: {
        sign,
        verify
    }
};