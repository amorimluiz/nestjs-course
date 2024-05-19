import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';

@Controller('user')
export class UserController {
    @Post()
    public async createUser(@Body() body: CreateUserDTO): Promise<any> {
        return body;
    }

    @Get()
    public async getUser(): Promise<any> {
        return {users: []};
    }

    @Get(':id')
    public async getUserById(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return {user: {}, id};
    }

    @Put(':id')
    public async updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDTO): Promise<any> {
        return {
            body,
            id,
        };
    }

    @Patch(':id')
    public async updatePartialUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePatchUserDTO): Promise<any> {
        return {
            body,
            id,
        };
    }

    @Delete(':id')
    public async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return {
            id
        };
    }
}
