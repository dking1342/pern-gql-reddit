"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.validateInput = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const validateInput = (options) => {
    let errorLog = [];
    if (options.username.length <= 2) {
        errorLog = [
            ...errorLog,
            {
                field: "username",
                message: "Username must be at least two characters long"
            }
        ];
    }
    if (options.password.length <= 2) {
        errorLog = [
            ...errorLog,
            {
                field: "password",
                message: "Password must be at least two characters long"
            }
        ];
    }
    return {
        errorLog,
        valid: Object.keys(errorLog).length < 1
    };
};
exports.validateInput = validateInput;
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        username: user.username,
    }, constants_1.__TOKEN_SECRET__, { expiresIn: '1hr' });
};
exports.generateToken = generateToken;
//# sourceMappingURL=validation.js.map