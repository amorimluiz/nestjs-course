import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private message = 'Hello World!';

  getMessage(): string {
    return this.message;
  }

  setMessage(str: string): void {
    this.message = str;
  }
}
