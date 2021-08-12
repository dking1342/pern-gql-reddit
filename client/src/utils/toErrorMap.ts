import { FieldError, PostError } from "../generated/graphql"


export const toErrorMap = (errors:FieldError[] | PostError[]) => {
    
    const errorMap: Record<string,string> = {};
    
    errors.forEach(({field,message}:{field:string,message:string})=>{
        errorMap[field] = message
    })

    return errorMap;
}