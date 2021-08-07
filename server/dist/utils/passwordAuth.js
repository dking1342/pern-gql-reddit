"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPasswordAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const isPasswordAuth = (token) => {
    let errors = [];
    try {
        const user = jsonwebtoken_1.default.verify(token, constants_1.__TOKEN_SECRET__);
        return {
            auth: user,
            errors,
        };
    }
    catch (error) {
        return {
            auth: null,
            errors: [
                {
                    field: "Auth Token",
                    message: "Invalid token"
                }
            ]
        };
    }
};
exports.isPasswordAuth = isPasswordAuth;
//# sourceMappingURL=passwordAuth.js.map