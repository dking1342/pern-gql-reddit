"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20210731205755 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20210731205755 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "user" add column "token" text null;');
    }
}
exports.Migration20210731205755 = Migration20210731205755;
//# sourceMappingURL=Migration20210731205755.js.map