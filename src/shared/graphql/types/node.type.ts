import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Node {
  @Field(() => Int)
  id: number;
}
