import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from '../../posts/models/post.model';
import { Node } from '../../../shared/graphql/types/node.type';

@ObjectType()
export class Author extends Node {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field(type => [Post])
  posts: Post[];
}
