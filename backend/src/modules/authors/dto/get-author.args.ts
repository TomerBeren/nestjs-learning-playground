import { MinLength } from 'class-validator';
import { Field, ArgsType } from '@nestjs/graphql';
import { PaginationArgs } from '../../../shared/graphql/args/pagination.args';

@ArgsType()
export class GetAuthorArgs extends PaginationArgs {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ defaultValue: '' })
  @MinLength(3)
  lastName: string;
}
