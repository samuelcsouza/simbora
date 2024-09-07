import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Device } from 'src/devices/device.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'root',
  database: 'postgres',
  entities: [Device],
  synchronize: true,
};
