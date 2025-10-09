import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CommentsService } from './comments.service';
import { PostsResolver } from './posts.resolver';
import { PostsSubscriptionResolver } from './posts-subscription.resolver';
import { AuthorsModule } from '../authors/authors.module';
import { DataloaderService } from '../../shared/dataloader/dataloader.service';
import { pubSubProvider } from '../../shared/graphql/pubsub.provider';

@Module({
  imports: [forwardRef(() => AuthorsModule)],
  providers: [
    PostsService,
    CommentsService,
    PostsResolver,
    PostsSubscriptionResolver,
    DataloaderService,
    pubSubProvider,
  ],
  exports: [PostsService],
})
export class PostsModule {}
