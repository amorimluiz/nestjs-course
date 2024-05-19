import { Body, Controller, Get, Param, Post } from '@nestjs/common';

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
}
