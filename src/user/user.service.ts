import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {}

    create(user: CreateUserDTO): Promise<User> {
        
        return this.prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
            }
        });
    }
}
