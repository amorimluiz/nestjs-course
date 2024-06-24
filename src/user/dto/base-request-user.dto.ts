import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { Role } from "src/enums/role.enum";

export class BaseRequestUserDTO {

    @IsString()
    public name: string;

    @IsEmail()
    public email: string;

    @IsStrongPassword({ minLength: 6 })
    public password: string;

    @IsOptional()
    @IsDateString()
    public birthdate?: string;

    @IsOptional()
    @IsEnum(Role)
    public role: number;
}