import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsResolver } from './authors.resolver';
import { AuthorsService } from './authors.service';
import { PostsService } from '../posts/posts.service';
import { DataloaderService } from '../../shared/dataloader/dataloader.service';
import { Author } from './models/author.model';
import { Post } from '../posts/models/post.model';
import { GetAuthorArgs } from './dto/get-author.args';

describe('AuthorsResolver', () => {
  let resolver: AuthorsResolver;
  let authorsService: AuthorsService;
  let postsService: PostsService;
  let dataloaderService: DataloaderService;

  const mockAuthorsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByName: jest.fn(),
    findByIds: jest.fn(),
  };

  const mockPostsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    upvoteById: jest.fn(),
  };

  const mockPostsByAuthorLoader = {
    load: jest.fn(),
  };

  const mockDataloaderService = {
    getPostsByAuthorLoader: jest.fn(() => mockPostsByAuthorLoader),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsResolver,
        {
          provide: AuthorsService,
          useValue: mockAuthorsService,
        },
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
        {
          provide: DataloaderService,
          useValue: mockDataloaderService,
        },
      ],
    }).compile();

    resolver = module.get<AuthorsResolver>(AuthorsResolver);
    authorsService = module.get<AuthorsService>(AuthorsService);
    postsService = module.get<PostsService>(PostsService);
    dataloaderService = module.get<DataloaderService>(DataloaderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getService', () => {
    it('should return the authors service', () => {
      expect(resolver.getService()).toBe(authorsService);
    });
  });

  describe('searchAuthors', () => {
    const mockAuthors: Author[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        posts: [],
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        posts: [],
      },
      {
        id: 3,
        firstName: 'John',
        lastName: 'Smith',
        posts: [],
      },
    ];

    it('should search authors by firstName only', async () => {
      const args: GetAuthorArgs = {
        firstName: 'John',
        lastName: '',
        offset: 0,
        limit: 10,
      };

      const expectedResults = mockAuthors.filter(a => a.firstName === 'John');
      mockAuthorsService.findByName.mockReturnValue(expectedResults);

      const result = await resolver.searchAuthors(args);

      expect(mockAuthorsService.findByName).toHaveBeenCalledWith('John', '');
      expect(result).toEqual(expectedResults);
    });

    it('should search authors by lastName only', async () => {
      const args: GetAuthorArgs = {
        firstName: undefined,
        lastName: 'Doe',
        offset: 0,
        limit: 10,
      };

      const expectedResults = mockAuthors.filter(a => a.lastName === 'Doe');
      mockAuthorsService.findByName.mockReturnValue(expectedResults);

      const result = await resolver.searchAuthors(args);

      expect(mockAuthorsService.findByName).toHaveBeenCalledWith(undefined, 'Doe');
      expect(result).toEqual(expectedResults);
    });

    it('should search authors by both firstName and lastName', async () => {
      const args: GetAuthorArgs = {
        firstName: 'John',
        lastName: 'Doe',
        offset: 0,
        limit: 10,
      };

      const expectedResults = [mockAuthors[0]];
      mockAuthorsService.findByName.mockReturnValue(expectedResults);

      const result = await resolver.searchAuthors(args);

      expect(mockAuthorsService.findByName).toHaveBeenCalledWith('John', 'Doe');
      expect(result).toEqual(expectedResults);
    });

    it('should apply pagination with offset and limit', async () => {
      const args: GetAuthorArgs = {
        firstName: undefined,
        lastName: '',
        offset: 1,
        limit: 2,
      };

      mockAuthorsService.findByName.mockReturnValue(mockAuthors);

      const result = await resolver.searchAuthors(args);

      expect(result).toEqual(mockAuthors.slice(1, 3));
      expect(result.length).toBe(2);
    });

    it('should handle pagination when offset exceeds results', async () => {
      const args: GetAuthorArgs = {
        firstName: undefined,
        lastName: '',
        offset: 10,
        limit: 5,
      };

      mockAuthorsService.findByName.mockReturnValue(mockAuthors);

      const result = await resolver.searchAuthors(args);

      expect(result).toEqual([]);
    });

    it('should return empty array when no authors match', async () => {
      const args: GetAuthorArgs = {
        firstName: 'NonExistent',
        lastName: 'Author',
        offset: 0,
        limit: 10,
      };

      mockAuthorsService.findByName.mockReturnValue([]);

      const result = await resolver.searchAuthors(args);

      expect(result).toEqual([]);
    });
  });

  describe('posts (ResolveField)', () => {
    const mockAuthor: Author = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      posts: [],
    };

    const mockPosts: Post[] = [
      {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
        author: mockAuthor,
      } as Post,
      {
        id: 2,
        title: 'Post 2',
        content: 'Content 2',
        author: mockAuthor,
      } as Post,
    ];

    it('should resolve posts for an author using DataLoader', async () => {
      mockPostsByAuthorLoader.load.mockResolvedValue(mockPosts);

      const result = await resolver.posts(mockAuthor);

      expect(dataloaderService.getPostsByAuthorLoader).toHaveBeenCalled();
      expect(mockPostsByAuthorLoader.load).toHaveBeenCalledWith(mockAuthor.id);
      expect(result).toEqual(mockPosts);
    });

    it('should resolve empty posts array when author has no posts', async () => {
      mockPostsByAuthorLoader.load.mockResolvedValue([]);

      const result = await resolver.posts(mockAuthor);

      expect(mockPostsByAuthorLoader.load).toHaveBeenCalledWith(mockAuthor.id);
      expect(result).toEqual([]);
    });

    it('should call DataLoader for each author independently', async () => {
      const author1: Author = { id: 1, firstName: 'John', lastName: 'Doe', posts: [] };
      const author2: Author = { id: 2, firstName: 'Jane', lastName: 'Smith', posts: [] };

      const posts1: Post[] = [{ id: 1, title: 'Post 1', content: 'Content 1', author: author1 } as Post];
      const posts2: Post[] = [{ id: 2, title: 'Post 2', content: 'Content 2', author: author2 } as Post];

      mockPostsByAuthorLoader.load
        .mockResolvedValueOnce(posts1)
        .mockResolvedValueOnce(posts2);

      const result1 = await resolver.posts(author1);
      const result2 = await resolver.posts(author2);

      expect(mockPostsByAuthorLoader.load).toHaveBeenCalledTimes(2);
      expect(mockPostsByAuthorLoader.load).toHaveBeenNthCalledWith(1, author1.id);
      expect(mockPostsByAuthorLoader.load).toHaveBeenNthCalledWith(2, author2.id);
      expect(result1).toEqual(posts1);
      expect(result2).toEqual(posts2);
    });
  });

  describe('upvotePost (Mutation)', () => {
    const mockPost: Post = {
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      votes: 5,
      author: { id: 1, firstName: 'John', lastName: 'Doe', posts: [] },
    } as Post;

    it('should upvote a post successfully', async () => {
      mockPostsService.upvoteById.mockReturnValue(mockPost);

      const result = await resolver.upvotePost({ postId: 1 });

      expect(mockPostsService.upvoteById).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockPost);
    });

    it('should return undefined when post does not exist', async () => {
      mockPostsService.upvoteById.mockReturnValue(undefined);

      const result = await resolver.upvotePost({ postId: 999 });

      expect(mockPostsService.upvoteById).toHaveBeenCalledWith({ id: 999 });
      expect(result).toBeUndefined();
    });
  });
});
