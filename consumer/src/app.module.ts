import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ObservationModule } from './observation/observation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObservationService } from './observation/observation.service';
import { ObservationRepository } from './observation/observation.repository';
import { typeOrmConfig } from './configs/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ObservationModule],
  controllers: [AppController],
  providers: [ObservationService, ObservationRepository],
})
export class AppModule {}
