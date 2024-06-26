import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import * as bcrypt from 'bcrypt';
import { MailerService } from "@nestjs-modules/mailer";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/entity/user.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly mailer: MailerService
    ) {} 

    public async generateToken(user: User): Promise<{accessToken: string}> {
        return {
            accessToken: this.jwtService.sign(
                {
                    role: user.role
                },
                {
                    expiresIn: "7d",
                    subject: String(user.id),
                    issuer: 'API NestJS'
                }
            )
        };
    }

    public validateToken(token: string): any {
        try {
            return this.jwtService.verify(token);
        } catch (e) {
            throw new UnauthorizedException(e);
        }
    }

    public isValidToken(token: string): boolean {
        try {
            return Boolean(this.validateToken(token));
        } catch (e) {
            return false;
        }
    }

    public async login(email: string, password: string) {
        const user = await this.userRepository.findOneBy({email});

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Email e/ou senha incorretos.');
        }

        return this.generateToken(user);
    }

    public async forget(email: string) {
        const user = await this.userRepository.findOneBy({email});
        
        if (!user) {
            throw new NotFoundException(`Usuário ${email} não encontrado.`);
        }

        const {accessToken} = await this.generateToken(user);

        await this.mailer.sendMail({
            subject: 'recuperação senha',
            to: 'felipe@test.com',
            template: 'forget',
            context: {
                name: 'Felipe',
                token: accessToken
            }
        });

        return true;
    }

    public async reset(password: string, token: string) {
        const {sub}: {sub: string} = this.validateToken(token);

        const id = Number(sub);

        if (isNaN(id)) {
            throw new BadRequestException('Token não possui um subject valido.');
        }

        const user = await this.userService.update(id, {password});
        
        return this.generateToken(user);
    }

    public async register(data: AuthRegisterDTO) {
        const user = await this.userService.create(data);

        return this.generateToken(user);
    }
} 