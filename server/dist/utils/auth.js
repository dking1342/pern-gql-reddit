"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const isAuth = (context) => {
    let errors = [];
    const authorization = context.req.headers.authorization;
    if (authorization) {
        const token = authorization.split('Bearer ')[1];
        if (token) {
            try {
                const user = jsonwebtoken_1.default.verify(token, constants_1.__TOKEN_SECRET__);
                return {
                    auth: user,
                    errors
                };
            }
            catch (error) {
                return {
                    auth: '',
                    errors: [
                        ...errors,
                        {
                            field: "Auth Token",
                            message: "Invalid/Expired token"
                        }
                    ]
                };
            }
        }
        else {
            return {
                auth: '',
                errors: [
                    ...errors,
                    {
                        field: "Auth Token",
                        message: "Authentication token must be formatted properly"
                    }
                ]
            };
        }
    }
    else {
        return {
            auth: '',
            errors: [
                ...errors,
                {
                    field: "Auth Token",
                    message: "Correct header must be given"
                }
            ]
        };
    }
};
exports.isAuth = isAuth;
//# sourceMappingURL=auth.js.map