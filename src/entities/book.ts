import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { PostEntity } from "./post";

@Entity({ name: "books" })
export class BookEntity {
  @PrimaryColumn({ type: "uuid" })
  public id!: string;

  @Column({ type: "varchar" })
  public title!: string;

  @Column({ type: "varchar" })
  public authors!: string[];

  @Column({ type: "varchar" })
  public isbnCode!: string;

  @Column({ type: "boolean" })
  public isRead!: boolean;

  @ManyToOne((_type) => PostEntity, (post) => (post.books))
  public posts!: Promise<PostEntity[]>
}
