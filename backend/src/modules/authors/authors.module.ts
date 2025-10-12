import { Module, forwardRef } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsResolver } from './authors.resolver';
import { PostsModule } from '../posts/posts.module';
import { DataloaderService } from '../../shared/dataloader/dataloader.service';

@Module({
  imports: [forwardRef(() => PostsModule)],
  providers: [AuthorsService, AuthorsResolver, DataloaderService],
  exports: [AuthorsService],
})
export class AuthorsModule {}
