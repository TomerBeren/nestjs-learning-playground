import { Resolver, Query, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { Post } from './models/post.model';
import { PostsService } from './posts.service';
import { Author } from '../authors/models/author.model';
import { DataloaderService } from '../../shared/dataloader/dataloader.service';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private postsService: PostsService,
    private dataloaderService: DataloaderService,
  ) {}

  @Query(() => [Post], { name: 'posts' })
  findAll(): Post[] {
    return this.postsService.findAll();
  }

  @Query(() => Post, { name: 'post', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number): Post | undefined {
    return this.postsService.findOne(id);
  }

  @ResolveField(() => Author)
  async author(@Parent() post: Post): Promise<Author> {
    // Uses DataLoader to batch author lookups
    return this.dataloaderService.getAuthorsLoader().load(post.author.id);
  }
}
