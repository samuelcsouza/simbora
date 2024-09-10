import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Observations } from './observation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Observations])],
  exports: [],
  providers: [],
  controllers: [],
})
export class ObservationsModule {}
