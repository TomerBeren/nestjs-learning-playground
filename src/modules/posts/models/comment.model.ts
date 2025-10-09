import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class Comment {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  postId: number;

  @Field()
  text: string;

  @Field()
  author: string;
}
