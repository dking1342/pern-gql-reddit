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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = void 0;
const Post_1 = require("../entities/Post");
const type_graphql_1 = require("type-graphql");
const auth_1 = require("../utils/auth");
const User_1 = require("../entities/User");
const typeorm_1 = require("typeorm");
let PostInput = class PostInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], PostInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], PostInput.prototype, "text", void 0);
PostInput = __decorate([
    type_graphql_1.InputType()
], PostInput);
let PostError = class PostError {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], PostError.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], PostError.prototype, "message", void 0);
PostError = __decorate([
    type_graphql_1.ObjectType()
], PostError);
let PostResponse = class PostResponse {
};
__decorate([
    type_graphql_1.Field(() => [PostError], { nullable: true }),
    __metadata("design:type", Object)
], PostResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => Post_1.Post, { nullable: true }),
    __metadata("design:type", Object)
], PostResponse.prototype, "post", void 0);
PostResponse = __decorate([
    type_graphql_1.ObjectType()
], PostResponse);
let PaginatedPost = class PaginatedPost {
};
__decorate([
    type_graphql_1.Field(() => [Post_1.Post]),
    __metadata("design:type", Array)
], PaginatedPost.prototype, "posts", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], PaginatedPost.prototype, "hasMore", void 0);
PaginatedPost = __decorate([
    type_graphql_1.ObjectType()
], PaginatedPost);
let PostResolver = class PostResolver {
    textSnippet(root) {
        return root.text.slice(0, 50);
    }
    async posts(limit, cursor) {
        const realLimit = Math.min(50, limit) + 1;
        const realLimitPlusOne = realLimit + 1;
        const replacements = [realLimitPlusOne,];
        if (cursor) {
            replacements.push(new Date(Number(cursor)));
        }
        const posts = await typeorm_1.getConnection().query(`
            SELECT 
            post.*, 
            json_build_object(
                'id',public.user.id,
                'username',public.user.username,
                'email',public.user.email
                ) creator
            FROM post
            ${cursor ? `WHERE post."createdAt" < $2` : ''}
            INNER JOIN public.user ON public.user.id = post.creator_id
            ORDER BY post."createdAt" DESC
            LIMIT $1
        `, replacements);
        return {
            hasMore: posts.length === realLimitPlusOne,
            posts: posts.slice(0, realLimit),
        };
    }
    postById(id) {
        return Post_1.Post.findOne(id);
    }
    async createPost(input, { req }) {
        let { auth, errors } = auth_1.isAuth(req);
        if (Boolean(errors.length)) {
            return {
                errors,
            };
        }
        else {
            try {
                const user = await User_1.User.findOne({ where: { username: auth.username } });
                if (!user) {
                    return {
                        errors: [
                            {
                                field: "username",
                                message: "no user found"
                            }
                        ]
                    };
                }
                const createdPost = await Post_1.Post.create(Object.assign(Object.assign({}, input), { creator_id: user.id })).save();
                return {
                    post: createdPost
                };
            }
            catch (error) {
                console.log('create post error', error.message);
                return {
                    errors: [
                        {
                            field: "post",
                            message: "post was not created"
                        }
                    ]
                };
            }
        }
    }
    async updatePost(id, title) {
        const post = await Post_1.Post.findOne(id);
        if (!post)
            return undefined;
        if (typeof title !== 'undefined') {
            await Post_1.Post.update({ id }, { title });
        }
        return post;
    }
    async deletePost(id) {
        try {
            await Post_1.Post.delete(id);
            return true;
        }
        catch (error) {
            return false;
        }
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => String),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "textSnippet", null);
__decorate([
    type_graphql_1.Query(() => PaginatedPost),
    __param(0, type_graphql_1.Arg('limit', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('cursor', () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    type_graphql_1.Query(() => Post_1.Post, { nullable: true }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "postById", null);
__decorate([
    type_graphql_1.Mutation(() => PostResponse),
    __param(0, type_graphql_1.Arg("input")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PostInput, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    type_graphql_1.Mutation(() => Post_1.Post, { nullable: true }),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg("title", () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
PostResolver = __decorate([
    type_graphql_1.Resolver(Post_1.Post)
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.js.map