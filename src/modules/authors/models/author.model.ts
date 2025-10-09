import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from '../../posts/models/post.model';
import { Node } from '../../../shared/graphql/types/node.type';
import { uppercaseMiddleware } from '../../../shared/graphql/middleware';

@ObjectType()
export class Author extends Node {
  @Field({ nullable: true, middleware: [uppercaseMiddleware] })
  firstName?: string;

  @Field({ nullable: true, middleware: [uppercaseMiddleware] })
  lastName?: string;

  @Field(type => [Post])
  posts: Post[];
}
