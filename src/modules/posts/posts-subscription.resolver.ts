import { Resolver, Subscription } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { Comment } from './models/comment.model';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from '../../shared/graphql/pubsub.provider';

@Resolver()
export class PostsSubscriptionResolver {
  constructor(@Inject(PUB_SUB) private pubSub: PubSub) {}

  @Subscription(() => Comment)
  commentAdded() {
    return this.pubSub.asyncIterableIterator('commentAdded');
  }
}
