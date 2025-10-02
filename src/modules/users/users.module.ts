
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { DatabaseModule } from '../../core/database/database.module';
import { UserSubscriber } from './subscribers/user.subscriber';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
  providers: [UsersService, UserSubscriber],
  exports: [UsersService, TypeOrmModule],
  controllers: [UsersController],
})
export class UsersModule {}
