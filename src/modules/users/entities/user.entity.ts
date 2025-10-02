import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { CatEntity } from "../../cats/entities/cat.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => CatEntity, cat => cat.owner)
  cats: CatEntity[];
}
