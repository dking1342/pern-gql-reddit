"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const post_mikro_1 = require("./resolvers/post-mikro");
const users_mikro_1 = require("./resolvers/users-mikro");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
const typeorm_2 = __importDefault(require("./config/typeorm"));
dotenv_1.default.config();
const main = async () => {
    try {
        const conn = await typeorm_1.createConnection(typeorm_2.default);
        console.log(conn);
        const app = express_1.default();
        const PORT = process.env.PORT;
        app.use(cors_1.default());
        const apolloServer = new apollo_server_express_1.ApolloServer({
            schema: await type_graphql_1.buildSchema({
                resolvers: [post_mikro_1.PostResolver, users_mikro_1.UserResolver],
                validate: false,
            }),
            context: (req) => ({ req })
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