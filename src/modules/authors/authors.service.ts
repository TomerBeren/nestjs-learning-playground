import { Injectable } from '@nestjs/common';
import { Author } from './entities/author.entity';
import { IBaseService } from '../../shared/graphql/resolvers/base.resolver';

@Injectable()
export class AuthorsService implements IBaseService<Author> {
  // In-memory data simulating database
  // Later: inject Repository<Author> for real DB
  private authors: Author[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      posts: [],
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      posts: [],
    },
  ];

  // ✅ Required by IBaseService
  findAll(): Author[] {
    return this.authors;
  }

  // ✅ Required by IBaseService
  findOne(id: number): Author | undefined {
    return this.authors.find(author => author.id === id);
  }

  // ✅ Extra method - specific to AuthorsService
  findOneById(id: number): Author | undefined {
    console.log(`AuthorsService.findOneById(${id})`);
    return this.authors.find(author => author.id === id);
  }

  // ✅ Extra method - for DataLoader batching
  findByIds(authorIds: number[]): Author[] {
    console.log(`AuthorsService.findByIds([${authorIds.join(', ')}])`);
    return authorIds.map(id => this.authors.find(author => author.id === id)).filter(Boolean) as Author[];
  }

  // ✅ Extra method - for search functionality
  findByName(firstName?: string, lastName?: string): Author[] {
    return this.authors.filter(author => {
      const firstNameMatch = !firstName || author.firstName?.toLowerCase().includes(firstName.toLowerCase());
      const lastNameMatch = !lastName || author.lastName?.toLowerCase().includes(lastName.toLowerCase());
      return firstNameMatch && lastNameMatch;
    });
  }
}
