import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMessage(): string {
    return this.appService.getMessage();
  }

  @Post()
  postMessage(): string {
    return this.appService.getMessage();
  }
}

