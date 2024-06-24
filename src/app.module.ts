import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 1800000,
      limit: 200
    }]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    PrismaModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'josephine.ratke84@ethereal.email',
            pass: 'AR1ZXwQhFyV9Bf6XkB'
        }
      },
      defaults: {
        from: '"Josephine" <josephine.ratke84@ethereal.emai>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
})
export class AppModule {}
