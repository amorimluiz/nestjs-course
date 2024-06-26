import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { Throttle } from '@nestjs/throttler';
import { User } from './entity/user.entity';
import { Role } from '../enums/role.enum';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';

@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RoleGuard)
@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post()
    public async createUser(@Body() body: CreateUserDTO): Promise<User> {
        return this.userService.create(body);
    }

    @Throttle({default: {ttl: 900000, limit: 50}})
    @Get()
    public async getUsers(): Promise<User[]> {
        return this.userService.list();
    }

    @Get(':id')
    public async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.userService.findById(id);
    }

    @Put(':id')
    public async updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDTO): Promise<User> {
        return this.userService.update(id, body);
    }

    @Patch(':id')
    public async updatePartialUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePatchUserDTO): Promise<User> {
        return this.userService.update(id, body);
    }

    @Delete(':id')
    public async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.userService.delete(id);
    }
}
