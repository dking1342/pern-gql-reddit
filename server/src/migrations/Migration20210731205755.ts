import { Migration } from '@mikro-orm/migrations';

export class Migration20210731205755 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "token" text null;');
  }

}
