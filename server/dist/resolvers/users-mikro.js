"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const registerValidation_1 = require("../utils/registerValidation");
const loginValidation_1 = require("../utils/loginValidation");
const generateToken_1 = require("../utils/generateToken");
const User_mikro_1 = require("../entities/User-mikro");
const auth_1 = require("../utils/auth");
const sendMail_1 = require("../utils/sendMail");
const passwordAuth_1 = require("../utils/passwordAuth");
let UsernamePasswordInput = class UsernamePasswordInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "password", void 0);
UsernamePasswordInput = __decorate([
    type_graphql_1.InputType()
], UsernamePasswordInput);
let RegisterInput = class RegisterInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], RegisterInput.prototype, "password", void 0);
RegisterInput = __decorate([
    type_graphql_1.InputType()
], RegisterInput);
let FieldError = class FieldError {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    type_graphql_1.ObjectType()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => User_mikro_1.User, { nullable: true }),
    __metadata("design:type", Object)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
let UserInfoResponse = class UserInfoResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserInfoResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => User_mikro_1.User, { nullable: true }),
    __metadata("design:type", Object)
], UserInfoResponse.prototype, "user", void 0);
UserInfoResponse = __decorate([
    type_graphql_1.ObjectType()
], UserInfoResponse);
let UserResolver = class UserResolver {
    async changePassword(token, newPassword, { em }) {
        if (newPassword.length <= 2) {
            return {
                errors: [
                    {
                        field: "newPassword",
                        message: "Password must be at least two characters long"
                    }
                ]
            };
        }
        let { auth, errors } = passwordAuth_1.isPasswordAuth(token);
        if (errors.length) {
            return {
                errors
            };
        }
        try {
            const user = await em.findOne(User_mikro_1.User, { username: auth.username });
            if (!user) {
                return {
                    errors: [
                        {
                            field: "token",
                            message: "invalid user"
                        }
                    ]
                };
            }
            user.password = await argon2_1.default.hash(newPassword);
            await em.persistAndFlush(user);
            let newToken = generateToken_1.generateToken(user);
            return {
                errors: [],
                user: Object.assign(Object.assign({}, user), { token: newToken })
            };
        }
        catch (error) {
            return {
                errors: [
                    {
                        field: "token",
                        message: error.message
                    }
                ]
            };
        }
    }
    async forgotPassword(email, { em }) {
        const user = await em.findOne(User_mikro_1.User, { email });
        if (!user) {
            return true;
        }
        const token = generateToken_1.generateToken(user);
        sendMail_1.sendEmail(email, `<a href="http://localhost:3000/change-password/${token}">reset password</a>`);
        return true;
    }
    async userInfo({ em, req }) {
        let { auth, errors } = auth_1.isAuth(req);
        if (Boolean(errors.length)) {
            return {
                errors
            };
        }
        else {
            try {
                const user = await em.findOne(User_mikro_1.User, { username: auth.username });
                return {
                    user
                };
            }
            catch (error) {
                return {
                    errors: [
                        {
                            field: "email",
                            message: "email address does not exists"
                        },
                    ]
                };
            }
        }
    }
    async register(options, { em }) {
        let { errorLog, valid } = registerValidation_1.registerValidation(options);
        if (!valid) {
            return {
                errors: errorLog
            };
        }
        const hashedPassword = await argon2_1.default.hash(options.password);
        let user = em.create(User_mikro_1.User, { username: options.username, email: options.email, password: hashedPassword });
        const token = generateToken_1.generateToken(user);
        try {
            await em.persistAndFlush(user);
        }
        catch (error) {
            if (error.code === '23505') {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "username or email already exists"
                        }
                    ]
                };
            }
        }
        return {
            user: Object.assign(Object.assign({}, user), { token }),
        };
    }
    async login(options, { em }) {
        let { errorLog, valid: validation } = loginValidation_1.loginValidation(options);
        if (!validation) {
            return {
                errors: errorLog,
                user: null
            };
        }
        try {
            const user = await em.findOne(User_mikro_1.User, { email: options.email });
            if (!user) {
                return {
                    errors: [
                        {
                            field: "email",
                            message: "email address does not exists"
                        },
                    ],
                };
            }
            ;
            const valid = await argon2_1.default.verify(user.password, options.password);
            if (!valid) {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "password incorrect"
                        }
                    ]
                };
            }
            ;
            const token = generateToken_1.generateToken(user);
            return {
                user: Object.assign(Object.assign({}, user), { token })
            };
        }
        catch (error) {
            return {
                errors: [
                    {
                        field: "general",
                        message: error.message
                    }
                ],
                user: null
            };
        }
    }
    async logout({ em, req }) {
        let { auth, errors } = auth_1.isAuth(req);
        if (errors.length) {
            return {
                errors,
                user: null
            };
        }
        try {
            const user = await em.findOne(User_mikro_1.User, { username: auth.username });
            if (!user) {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "username not found"
                        }
                    ],
                    user: null
                };
            }
            else {
                return {
                    errors: [],
                    user
                };
            }
        }
        catch (error) {
            console.log(error.message);
            return {
                errors: [
                    {
                        field: "general",
                        message: error.message
                    }
                ],
                user: null
            };
        }
    }
};
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('token')),
    __param(1, type_graphql_1.Arg('newPassword')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg('email')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    type_graphql_1.Query(() => UserInfoResponse, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "userInfo", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('options', () => RegisterInput)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('options', () => UsernamePasswordInput)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=users-mikro.js.map