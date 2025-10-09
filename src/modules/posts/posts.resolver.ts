import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
  Mutation,
} from "@nestjs/graphql";
import { Inject } from "@nestjs/common";
import { Post } from "./models/post.model";
import { Comment } from "./models/comment.model";
import { CommentInput } from "./dto/comment.input";
import { PostsService } from "./posts.service";
import { CommentsService } from "./comments.service";
import { Author } from "../authors/models/author.model";
import { DataloaderService } from "../../shared/dataloader/dataloader.service";
import { PubSub } from "graphql-subscriptions";
import { PUB_SUB } from "../../shared/graphql/pubsub.provider";

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private postsService: PostsService,
    private commentsService: CommentsService,
    private dataloaderService: DataloaderService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  @Query(() => [Post], { name: "posts" })
  findAll(): Post[] {
    return this.postsService.findAll();
  }

  @Query(() => Post, { name: "post", nullable: true })
  findOne(@Args("id", { type: () => Int }) id: number): Post | undefined {
    return this.postsService.findOne(id);
  }

  @Mutation(() => Comment)
  async addComment(
    @Args("postId", { type: () => Int }) postId: number,
    @Args("comment", { type: () => CommentInput }) comment: CommentInput
  ) {
    const newComment = this.commentsService.addComment({ id: postId, comment });
    this.pubSub.publish("commentAdded", { commentAdded: newComment });
    return newComment;
  }

  @ResolveField(() => Author)
  async author(@Parent() post: Post): Promise<Author> {
    // Uses DataLoader to batch author lookups
    return this.dataloaderService.getAuthorsLoader().load(post.author.id);
  }
}
