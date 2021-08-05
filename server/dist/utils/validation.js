"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = void 0;
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
//# sourceMappingURL=validation.js.map