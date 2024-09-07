import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Observation } from './observation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Observation])],
  exports: [],
  providers: [],
  controllers: [],
})
export class ObservationModule {}
