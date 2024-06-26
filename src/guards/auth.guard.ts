import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService
    ) {}
    
    public canActivate(context: ExecutionContext): boolean {
        const {authorization} = context.switchToHttp().getRequest().headers;

        return this.authService.isValidToken((authorization ?? '').split(' ')[1]);
    }
}