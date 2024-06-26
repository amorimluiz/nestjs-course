import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { ConfigModule } from '@nestjs/config';
import { SnakeCaseStrategy } from 'db/snakecase';
import { User } from './user/entity/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
      namingStrategy: new SnakeCaseStrategy(),
      entities: [User]
    }),
    ThrottlerModule.forRoot([{
      ttl: 1800000,
      limit: 200
    }]),
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
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}
