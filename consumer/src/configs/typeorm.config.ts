import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Observations } from 'src/observations/observation.entity';
import { config } from 'dotenv';

config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: 'postgres',
  entities: [Observations],
  synchronize: true,
};
