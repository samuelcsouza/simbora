import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { ObservationsModule } from './observations/observation.module';
import { ObservationsRepository } from './observations/observation.repository';
import { ObservationsService } from './observations/observation.service';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ObservationsModule],
  controllers: [AppController],
  providers: [ObservationsService, ObservationsRepository],
})
export class AppModule {}
