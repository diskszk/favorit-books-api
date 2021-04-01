import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1617268683698 implements MigrationInterface {
  name = 'init1617268683698';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `books` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `author` varchar(255) NOT NULL, `isbnCode` varchar(255) NOT NULL, `isRead` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `posts` (`id` int NOT NULL AUTO_INCREMENT, `varchar` varchar(255) NOT NULL, `text` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `username` varchar(255) NOT NULL, `displayUserId` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `posts` ADD CONSTRAINT `FK_ae05faaa55c866130abef6e1fee` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `posts` DROP FOREIGN KEY `FK_ae05faaa55c866130abef6e1fee`'
    );
    await queryRunner.query('DROP TABLE `users`');
    await queryRunner.query('DROP TABLE `posts`');
    await queryRunner.query('DROP TABLE `books`');
  }
}
