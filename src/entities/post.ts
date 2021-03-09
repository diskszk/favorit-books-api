import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { UserEntity } from ".";
import { BookEntity } from "./book";

@Entity({ name: "posts" })
export class PostEntity {
  @PrimaryColumn({ type: "uuid" })
  public id!: string;

  // @Column({ name: "varchar" })
  // public comment!: string;

  // @ManyToOne((_type) => UserEntity, (user) => user.posts)
  // public user!: Promise<UserEntity[]>;

  @OneToMany((_type) => BookEntity, (book) => book.posts)
  public books!: Promise<BookEntity[]>;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  public createdAt!: Date;
}
