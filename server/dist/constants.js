"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.__TOKEN_SECRET__ = exports.__db_type__ = exports.__db_pw__ = exports.__db_user__ = exports.__db_name__ = exports.__prod__ = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.__prod__ = process.env.NODE_ENV === 'production';
exports.__db_name__ = process.env.DB_NAME;
exports.__db_user__ = process.env.DB_USER;
exports.__db_pw__ = process.env.DB_PASSWORD;
exports.__db_type__ = process.env.DB_TYPE;
exports.__TOKEN_SECRET__ = process.env.TOKEN_SECRET;
//# sourceMappingURL=constants.js.map