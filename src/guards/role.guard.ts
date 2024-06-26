import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "../auth/auth.service";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role } from "../enums/role.enum";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly authService: AuthService
    ) {}
    
    public canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getClass(), context.getHandler()]);

        if (!requiredRoles) {
            return true;
        }

        const {authorization} = context.switchToHttp().getRequest().headers;

        try {
            const {role} = this.authService.validateToken(authorization.split(' ')[1]);
            return requiredRoles.includes(role);
        } catch (e) {
            throw e;
        }
    }
}