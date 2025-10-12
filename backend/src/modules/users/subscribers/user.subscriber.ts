import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { BcryptUtil } from '../../../core/common/utils/bcrypt.util';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    console.log(`BEFORE USER INSERTED: `, event.entity);
    
    // Hash the password before inserting into database
    if (event.entity.password) {
      event.entity.password = await BcryptUtil.hashPassword(event.entity.password);
      console.log(`Password hashed for user: ${event.entity.username}`);
    }
  }
}
