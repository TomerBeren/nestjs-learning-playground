import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Author } from '../../authors/models/author.model';
import { Node } from '../../../shared/graphql/types/node.type';

@ObjectType()
export class Post extends Node {
  @Field({ complexity: 1 })
  title: string;

  @Field({ nullable: true, complexity: 1 })
  content?: string;

  @Field(type => Int, { nullable: true, complexity: 1 })
  votes?: number;

  @Field(type => Author, { complexity: 3 })
  author: Author;
}
