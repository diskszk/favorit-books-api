import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { PostEntity } from ".";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryColumn({ type: "uuid" })
  public id!: string;

  @Column({ type: "varchar" })
  public encryptedEmail!: string;

  @Column({ type: "varchar" })
  public salt!: string;

  @Column({ type: "varchar" })
  public passwordHash!: string;

  @Column({ type: "varchar", nullable: true })
  public displayName!: string;

  @Column({ type: "varchar", nullable: true })
  public displayUserId!: string;

  // @OneToMany((type) => PostEntity, (post) => post.user)
  // public posts!: Promise<PostEntity[]>;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  public createdAt!: Date;
}
