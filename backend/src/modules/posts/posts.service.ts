import { Injectable } from '@nestjs/common';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  // In-memory data simulating database
  // Later: inject Repository<Post> for real DB
  private posts: Post[] = [
    {
      id: 1,
      title: 'First Post',
      content: 'This is the content of the first post',
      author: { id: 1, firstName: 'John', lastName: 'Doe', posts: [] },
      votes: 0,
    },
    {
      id: 2,
      title: 'Second Post',
      content: 'This is the content of the second post',
      author: { id: 2, firstName: 'Jane', lastName: 'Smith', posts: [] },
      votes: 0,
    },
    {
      id: 3,
      title: 'Third Post',
      content: 'Another post by John',
      author: { id: 1, firstName: 'John', lastName: 'Doe', posts: [] },
      votes: 0,
    },
  ];

  findAll(): Post[] {
    return this.posts;
  }

  findOne(id: number): Post | undefined {
    return this.posts.find(post => post.id === id);
  }

  findByAuthorId(authorId: number): Post[] {
    console.log(`PostsService.findByAuthorId(${authorId})`);
    return this.posts.filter(post => post.author.id === authorId);
  }

  // Batch method for DataLoader - fetches posts for multiple authors at once
  findByAuthorIds(authorIds: number[]): Post[][] {
    console.log(`PostsService.findByAuthorIds([${authorIds.join(', ')}]) - BATCHED!`);
    return authorIds.map(authorId => 
      this.posts.filter(post => post.author.id === authorId)
    );
  }

  // Upvote a post by id
  upvoteById(args: { id: number }): Post | undefined {
    const post = this.posts.find(p => p.id === args.id);
    if (post) {
      post.votes = (post.votes || 0) + 1;
    }
    return post;
  }
}
