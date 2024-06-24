import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { Throttle } from '@nestjs/throttler';

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
    public async getUsers(): Promise<any> {
        return this.userService.list();
    }

    @Get(':id')
    public async getUserById(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.userService.getById(id);
    }

    @Put(':id')
    public async updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDTO): Promise<any> {
        return this.userService.update(id, body);
    }

    @Patch(':id')
    public async updatePartialUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePatchUserDTO): Promise<any> {
        return this.userService.updatePartial(id, body);
    }

    @Delete(':id')
    public async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.userService.delete(id);
    }
}
