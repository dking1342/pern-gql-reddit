"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const post_1 = require("./resolvers/post");
const users_1 = require("./resolvers/users");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const main = async () => {
    try {
        const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
        await orm.getMigrator().up();
        const app = express_1.default();
        const PORT = process.env.PORT;
        app.use(cors_1.default());
        const apolloServer = new apollo_server_express_1.ApolloServer({
            schema: await type_graphql_1.buildSchema({
                resolvers: [post_1.PostResolver, users_1.UserResolver],
                validate: false,
            }),
            context: (req) => ({ em: orm.em, req: req })
        });
        await apolloServer.start();
        await apolloServer.applyMiddleware({ app });
        app.listen(PORT, () => console.log('server listening on port 4000'));
    }
    catch (error) {
        console.log('---- error ----', error.message);
    }
};
main();
//# sourceMappingURL=index.js.map