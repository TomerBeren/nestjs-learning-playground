import { ObjectType, Field, Int, Extensions } from '@nestjs/graphql';
import { checkRoleMiddleware } from '../../../shared/graphql/middleware';
import { Role } from '../../../core/common/enums/role.enum';

@ObjectType()
export class UserType {
  @Field(() => Int)
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  username: string;

  @Field({ 
    middleware: [checkRoleMiddleware],
    description: 'Only accessible by ADMIN users'
  })
  @Extensions({ role: Role.ADMIN })
  password: string;

  @Field({ 
    middleware: [checkRoleMiddleware],
    description: 'Only accessible by MODERATOR and ADMIN users'
  })
  @Extensions({ role: Role.MODERATOR })
  isActive: boolean;
}
