import { Field, Int, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 0 })
  offset: number = 0;

  @Field(() => Int, { defaultValue: 10 })
  limit: number = 10;
}
