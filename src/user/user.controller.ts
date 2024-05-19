import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post()
    public async createUser(@Body() body: CreateUserDTO): Promise<User> {
        return this.userService.create(body);
    }

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
