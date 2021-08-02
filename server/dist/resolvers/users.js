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
exports.UsersResolver = void 0;
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const validation_1 = require("../utils/validation");
const Users_1 = require("../entities/Users");
const auth_1 = require("../utils/auth");
let UsernamePasswordInput = class UsernamePasswordInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "password", void 0);
UsernamePasswordInput = __decorate([
    type_graphql_1.InputType()
], UsernamePasswordInput);
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
    type_graphql_1.Field(() => Users_1.Users, { nullable: true }),
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
    type_graphql_1.Field(() => UserInfo, { nullable: true }),
    __metadata("design:type", Object)
], UserInfoResponse.prototype, "userInfo", void 0);
UserInfoResponse = __decorate([
    type_graphql_1.ObjectType()
], UserInfoResponse);
let UserInfo = class UserInfo {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UserInfo.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], UserInfo.prototype, "iat", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], UserInfo.prototype, "exp", void 0);
UserInfo = __decorate([
    type_graphql_1.ObjectType()
], UserInfo);
let UsersResolver = class UsersResolver {
    userInfo({ req }) {
        let { auth, errors } = auth_1.isAuth(req);
        if (Boolean(errors.length)) {
            return {
                errors,
                userInfo: null
            };
        }
        else {
            return {
                errors: [],
                userInfo: {
                    username: auth.username,
                    iat: auth.iat,
                    exp: auth.exp
                }
            };
        }
    }
    async register(options, { em }) {
        let { errorLog, valid } = validation_1.validateInput(options);
        if (!valid) {
            return {
                errors: errorLog
            };
        }
        const hashedPassword = await argon2_1.default.hash(options.password);
        let user = em.create(Users_1.Users, { username: options.username, password: hashedPassword });
        const token = validation_1.generateToken(user);
        try {
            await em.persistAndFlush(user);
        }
        catch (error) {
            if (error.code === '23505') {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "username already exists"
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
        const user = await em.findOne(Users_1.Users, { username: options.username });
        if (!user) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "username does not exists"
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
        const token = validation_1.generateToken(user);
        return {
            user: Object.assign(Object.assign({}, user), { token })
        };
    }
    logout({ req }) {
        let { errors } = auth_1.isAuth(req);
        console.log(errors);
        return !Boolean(errors.length);
    }
};
__decorate([
    type_graphql_1.Query(() => UserInfoResponse, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", UserInfoResponse)
], UsersResolver.prototype, "userInfo", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('options', () => UsernamePasswordInput)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('options', () => UsernamePasswordInput)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersResolver.prototype, "logout", null);
UsersResolver = __decorate([
    type_graphql_1.Resolver()
], UsersResolver);
exports.UsersResolver = UsersResolver;
//# sourceMappingURL=users.js.map