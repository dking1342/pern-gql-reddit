import { Request, Response } from "express";

// export type MyContext = {
//     em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>,
//     req: Request,
//     res: Response
// }

export type TypeormContext = {
    req: Request,
    res: Response,
}

export type FieldError = {
    field:string,
    message:string
}