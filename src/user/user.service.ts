import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {}

    public async create(user: CreateUserDTO): Promise<User> {
        return this.prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
                birthdate: user.birthdate ? new Date(user.birthdate) : null,
            }
        });
    }

    public async list(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    public async getById(id: number): Promise<User> {
        return this.prisma.user.findUnique({
            where: {
                id,
            }
        });
    }

    public async update(id: number, data: UpdateUserDTO): Promise<User> {
        await this.exits(id);

        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                birthdate: data.birthdate ? new Date(data.birthdate) : null,
            }
        });
    }

    public async updatePartial(id: number, data: UpdatePatchUserDTO): Promise<User> {
        await this.exits(id);

        let birthdate: Date;

        if (data.birthdate) {
            birthdate = new Date(data.birthdate);
        }

        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                birthdate,
            }
        });
    }

    public async delete(id: number): Promise<User> {
        await this.exits(id);

        return this.prisma.user.delete({
            where: {
                id,
            }
        });
    }

    private async exits(id: number): Promise<void> {
        if (!(await this.getById(id))) {
            throw new NotFoundException(`Usuário com id ${id} não encontrado`);
        }
    }
}
