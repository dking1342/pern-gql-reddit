"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20210802001320 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20210802001320 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "users" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" text not null, "password" text not null, "token" text null);');
        this.addSql('alter table "users" add constraint "users_username_unique" unique ("username");');
        this.addSql('drop table if exists "user" cascade;');
    }
}
exports.Migration20210802001320 = Migration20210802001320;
//# sourceMappingURL=Migration20210802001320.js.map