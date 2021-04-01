import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// ユーザーごとの読んだ/読みたい本
@Entity({ name: 'books' })
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id?: string;

  @Column({ type: 'varchar' })
  readonly title: string;

  @Column({ type: 'varchar' })
  readonly author: string;

  @Column({ type: 'varchar' })
  readonly isbnCode: string;

  @Column({ type: 'boolean' })
  public isRead: boolean = false;

  constructor(title: string, author: string, isbnCode: string) {
    super();
    this.title = title;
    this.author = author;
    this.isbnCode = isbnCode;
  }
}
