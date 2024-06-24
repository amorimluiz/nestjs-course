import { IsEmail } from "class-validator";

export class AuthForgetDTO {

    @IsEmail()
    public email: string;
    
}