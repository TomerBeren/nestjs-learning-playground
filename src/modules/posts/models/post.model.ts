import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Author } from '../../authors/models/author.model';
import { Node } from '../../../shared/graphql/types/node.type';

@ObjectType()
export class Post extends Node {
  @Field()
  title: string;

  @Field({ nullable: true })
  content?: string;

  @Field(type => Int, { nullable: true })
  votes?: number;

  @Field(type => Author)
  author: Author;
}
