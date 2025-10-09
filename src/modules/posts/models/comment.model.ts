import { Field, ObjectType, Int } from '@nestjs/graphql';
import { logFieldAccessMiddleware } from '../../../shared/graphql/middleware';

@ObjectType()
export class Comment {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  postId: number;

  @Field({ middleware: [logFieldAccessMiddleware] })
  text: string;

  @Field()
  author: string;
}
