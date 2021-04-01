import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { Post } from './post';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id?: string;

  @Column({ type: 'varchar' })
  public username: string;

  @Column({ type: 'varchar' })
  public displayUserId: string;

  @CreateDateColumn()
  readonly createdAt?: Date;

  @OneToMany((_type) => Post, (post) => post.user)
  public posts?: Post[];

  constructor(username: string, displayUserId: string) {
    super();
    this.username = username;
    this.displayUserId = displayUserId;
  }
}
