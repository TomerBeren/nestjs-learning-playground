import { Field, ObjectType, Extensions } from '@nestjs/graphql';
import { Post } from '../../posts/models/post.model';
import { Node } from '../../../shared/graphql/types/node.type';
import { uppercaseMiddleware, checkRoleMiddleware } from '../../../shared/graphql/middleware';
import { Role } from '../../../core/common/enums/role.enum';

@ObjectType()
export class Author extends Node {
  @Field({ nullable: true, middleware: [uppercaseMiddleware] })
  firstName?: string;

  @Field({ nullable: true, middleware: [uppercaseMiddleware] })
  lastName?: string;

  @Field({ 
    nullable: true, 
    middleware: [checkRoleMiddleware],
    description: 'Only accessible by MODERATOR and ADMIN users'
  })
  @Extensions({ role: Role.MODERATOR })
  email?: string;

  @Field(type => [Post])
  posts: Post[];
}
