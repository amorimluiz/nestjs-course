import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Post()
    public async createUser(@Body() body: any): Promise<any> {
        return body;
    }

    @Get()
    public async getUser(): Promise<any> {
        return {users: []};
    }

    @Get(':id')
    public async getUserById(@Param() params: {id: string}): Promise<any> {
        return {user: {}, params};
    }

    @Put(':id')
    public async updateUser(@Param() params: {id: string}, @Body() body: any): Promise<any> {
        return {
            body,
            params,
        };
    }

    @Patch(':id')
    public async updatePartialUser(@Param() params: {id: string}, @Body() body: any): Promise<any> {
        return {
            body,
            params,
        };
    }

    @Delete(':id')
    public async deleteUser(@Param() params: {id: string}): Promise<any> {
        return params;
    }
}
