"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20210805185908 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20210805185908 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" text not null, "password" text not null, "email" text not null, "token" text null);');
        this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
        this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    }
}
exports.Migration20210805185908 = Migration20210805185908;
//# sourceMappingURL=Migration20210805185908.js.map