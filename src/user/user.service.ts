import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    public async create(data: CreateUserDTO): Promise<User> {
        if (await this.userRepository.existsBy({email: data.email})) {
            throw new BadRequestException(`Email ${data.email} já cadastrado.`);
        }

        const user = this.userRepository.create();

        user.name = data.name;
        user.email = data.email;
        user.password = await bcrypt.hash(data.password, await bcrypt.genSalt());
        user.role = data.role;

        if(data.birthdate) {
            user.birthdate = new Date(data.birthdate);
        }
        
        return this.userRepository.save(user);
    }

    public async list(): Promise<User[]> {
        return this.userRepository.find();
    }

    public async findById(id: number): Promise<User | null> {
        return this.userRepository.findOneBy({id});
    }

    public async update(id: number, data: UpdateUserDTO | UpdatePatchUserDTO): Promise<User> {
        const user = await this.findById(id);

        if (!user) {
            throw new NotFoundException(`Usuário com id ${id} não encontrado`);
        }

        user.name = data.name;
        user.email = data.email;
        user.role = data.role;

        if (data.password) {
            user.password = await bcrypt.hash(data.password, await bcrypt.genSalt());
        }

        if(data.birthdate) {
            user.birthdate = new Date(data.birthdate);
        }

        await this.userRepository.update(id, user);

        return this.userRepository.save(await this.findById(id));
    }

    public async delete(id: number): Promise<User> {
        if (!await this.userRepository.existsBy({ id })) {
            throw new NotFoundException(`Usuário com id ${id} não encontrado`);
        }

        const user = await this.findById(id);

        await this.userRepository.delete(id);

        return user;
    }
}
