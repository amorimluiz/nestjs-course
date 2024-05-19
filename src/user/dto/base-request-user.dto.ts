import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class BaseRequestUserDTO {

    @IsString()
    public name: string;

    @IsEmail()
    public email: string;

    @IsStrongPassword({ minLength: 6 })
    public password: string;
}