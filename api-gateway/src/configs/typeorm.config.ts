import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Device } from 'src/devices/device.entity';
import { Observation } from 'src/observation/observation.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'root',
  database: 'postgres',
  entities: [Device, Observation],
  synchronize: true,
};
