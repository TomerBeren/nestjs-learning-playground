import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Post } from '../../modules/posts/entities/post.entity';
import { Author } from '../../modules/authors/entities/author.entity';
import { PostsService } from '../../modules/posts/posts.service';
import { AuthorsService } from '../../modules/authors/authors.service';
import { createPostsByAuthorLoader, createAuthorsLoader } from './dataloader.factory';

@Injectable({ scope: Scope.REQUEST })
export class DataloaderService {
  private readonly postsByAuthorLoader: DataLoader<number, Post[]>;
  private readonly authorsLoader: DataLoader<number, Author>;

  constructor(
    private readonly postsService: PostsService,
    private readonly authorsService: AuthorsService,
  ) {
    this.postsByAuthorLoader = createPostsByAuthorLoader(postsService);
    this.authorsLoader = createAuthorsLoader(authorsService);
  }

  getPostsByAuthorLoader(): DataLoader<number, Post[]> {
    return this.postsByAuthorLoader;
  }

  getAuthorsLoader(): DataLoader<number, Author> {
    return this.authorsLoader;
  }
}
