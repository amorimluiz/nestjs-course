import { join } from "path";
import { env } from "process";
import { DataSource } from "typeorm";
import { SnakeCaseStrategy } from "./snakecase";
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
    type: 'mysql',
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    charset: 'utf8mb4',
    synchronize: false,
    migrationsRun: true,
    dropSchema: false,
    namingStrategy: new SnakeCaseStrategy(),
    entities: [join(__dirname, '..', 'src', '**', '*.entity.js')],
    migrations: [join(__dirname, 'migrations', '**', '*.js')]
});

export default dataSource;