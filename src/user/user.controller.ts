import { Body, Controller, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Post()
    public async createUser(@Body() body: any): Promise<any> {
        return body;
    }
}
