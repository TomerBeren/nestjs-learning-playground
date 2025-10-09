import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Author } from '../../authors/entities/author.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'text' })
  content?: string;

  @Column({ default: 0 })
  votes?: number;

  @ManyToOne(() => Author, author => author.posts)
  author: Author;
}
