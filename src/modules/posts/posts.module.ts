import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { AuthorsModule } from '../authors/authors.module';
import { DataloaderService } from '../../shared/dataloader/dataloader.service';

@Module({
  imports: [forwardRef(() => AuthorsModule)],
  providers: [PostsService, PostsResolver, DataloaderService],
  exports: [PostsService],
})
export class PostsModule {}
