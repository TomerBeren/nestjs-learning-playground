import { Injectable } from '@nestjs/common';
import { Comment } from './models/comment.model';

@Injectable()
export class CommentsService {
  private comments: Comment[] = [];
  private currentId = 1;

  addComment(data: { id: number; comment: { text: string; author: string } }): Comment {
    const newComment: Comment = {
      id: this.currentId++,
      postId: data.id,
      text: data.comment.text,
      author: data.comment.author,
    };
    this.comments.push(newComment);
    return newComment;
  }

  getCommentsByPostId(postId: number): Comment[] {
    return this.comments.filter(comment => comment.postId === postId);
  }
}
