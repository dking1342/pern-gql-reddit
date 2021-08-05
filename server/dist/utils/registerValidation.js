"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerValidation = void 0;
const registerValidation = (options) => {
    let errorLog = [];
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (options.username.length <= 2) {
        errorLog = [
            ...errorLog,
            {
                field: "username",
                message: "Username must be at least two characters long"
            }
        ];
    }
    if (!options.email.match(regEx)) {
        errorLog = [
            ...errorLog,
            {
                field: "email",
                message: "Email must be a vaild email address"
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
exports.registerValidation = registerValidation;
//# sourceMappingURL=registerValidation.js.map