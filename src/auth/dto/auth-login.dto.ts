import { IsEmail, IsString } from "class-validator";

export class AuthLoginDTO {
    
    @IsEmail()
    public email: string;

    @IsString()
    public password: string;
    
}