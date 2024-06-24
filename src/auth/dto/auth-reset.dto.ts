import { IsJWT, IsStrongPassword } from "class-validator";

export class AuthResetDTO {
    
    @IsStrongPassword({ minLength: 6 })
    public password: string;

    @IsJWT()
    public token: string;

}