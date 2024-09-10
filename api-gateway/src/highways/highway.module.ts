import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Highways } from './highway.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Highways])],
  exports: [],
  providers: [],
  controllers: [],
})
export class HighwayModule {}
