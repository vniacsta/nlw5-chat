import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateSettings1619281328939 implements MigrationInterface {
  
  // to execute: yarn typeorm migration:run
  public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'settings',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
            },
            {
              name: 'username',
              type: 'varchar',
            },
            {
              name: 'chat',
              type: 'boolean',
              default: true,
            },
            {
              name: 'update_at',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'create_at',
              type: 'timestamp',
              default: 'now()',
            },
          ],
        })
      );
  }

  // to execute: yarn typeorm migration:revert
  public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('settings');
  }
}
