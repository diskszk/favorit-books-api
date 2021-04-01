import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  Column,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { User } from './user';

@Entity({ name: 'posts' })
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id?: string;

  @Column({ name: 'varchar' })
  public title: string;

  @Column({ name: 'text' })
  public text: string;

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;

  @Column()
  readonly userId: string;

  @ManyToOne((_type) => User, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  readonly user?: User;

  constructor(title: string, text: string, userId: string) {
    super();
    this.title = title;
    this.text = text;
    this.userId = userId;
  }
}
