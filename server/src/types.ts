import { Request, Response } from "express";
import { creatorLoader } from "./utils/creatorLoader";
import { voteLoader } from "./utils/voteLoader";

// export type MyContext = {
//     em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>,
//     req: Request,
//     res: Response
// }

export type TypeormContext = {
    req: Request,
    res: Response,
    userLoader:ReturnType<typeof creatorLoader>,
    voteLoader:ReturnType<typeof voteLoader>,
}

export type FieldError = {
    field:string,
    message:string
}