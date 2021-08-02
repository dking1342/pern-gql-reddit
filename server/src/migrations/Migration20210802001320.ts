import { Migration } from '@mikro-orm/migrations';

export class Migration20210802001320 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "users" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" text not null, "password" text not null, "token" text null);');
    this.addSql('alter table "users" add constraint "users_username_unique" unique ("username");');

    this.addSql('drop table if exists "user" cascade;');
  }

}
