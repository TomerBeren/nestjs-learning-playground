import DataLoader from 'dataloader';
import { Post } from '../../modules/posts/entities/post.entity';
import { PostsService } from '../../modules/posts/posts.service';
import { Author } from '../../modules/authors/entities/author.entity';
import { AuthorsService } from '../../modules/authors/authors.service';

export const POSTS_BY_AUTHOR_LOADER = 'POSTS_BY_AUTHOR_LOADER';
export const AUTHORS_LOADER = 'AUTHORS_LOADER';

export const createPostsByAuthorLoader = (postsService: PostsService) => {
  return new DataLoader<number, Post[]>(async (authorIds: readonly number[]) => {
    return postsService.findByAuthorIds([...authorIds]);
  });
};

export const createAuthorsLoader = (authorsService: AuthorsService) => {
  return new DataLoader<number, Author>(async (authorIds: readonly number[]) => {
    const authors = authorsService.findByIds([...authorIds]);
    // DataLoader expects results in same order as keys
    return authorIds.map(id => authors.find(author => author.id === id)!);
  });
};
