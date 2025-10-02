import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CatEntity } from './entities/cat.entity';
import { DatabaseModule } from '../../core/database/database.module';
import featuresConfig from '../../config/features.config';

@Module({
  imports: [
    ConfigModule.forFeature(featuresConfig),
    DatabaseModule,
    TypeOrmModule.forFeature([CatEntity]),
  ],
  controllers: [CatsController],
  exports: [CatsService],
  providers: [CatsService],
})
export class CatsModule {}
