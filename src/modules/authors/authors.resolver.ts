import { Resolver, Query, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { Author } from './models/author.model';
import { AuthorsService } from './authors.service';
import { Post } from '../posts/models/post.model';
import { DataloaderService } from '../../shared/dataloader/dataloader.service';
import { GetAuthorArgs } from './dto/get-author.args';
import { BaseResolver } from '../../shared/graphql/resolvers/base.resolver';

@Resolver(() => Author)
export class AuthorsResolver extends BaseResolver(Author) {
  constructor(
    private authorsService: AuthorsService,
    private dataloaderService: DataloaderService,
  ) {
    super();
  }

  // Required by BaseResolver - tells it which service to use
  getService() {
    return this.authorsService;
  }

  // BaseResolver provides these queries automatically:
  // - findAllAuthor(): calls authorsService.findAll()
  // - findOneAuthor(id): calls authorsService.findOne(id)

  // Custom query specific to Authors
  @Query(() => [Author], { name: 'searchAuthors' })
  async searchAuthors(@Args() getAuthorArgs: GetAuthorArgs): Promise<Author[]> {
    const { firstName, lastName, offset, limit } = getAuthorArgs;
    const results = this.authorsService.findByName(firstName, lastName);
    
    // Apply pagination
    return results.slice(offset, offset + limit);
  }

  @ResolveField('posts', () => [Post])
  async posts(@Parent() author: Author): Promise<Post[]> {
    // Uses DataLoader to batch requests - solves N+1 problem!
    return this.dataloaderService.getPostsByAuthorLoader().load(author.id);
  }
}
