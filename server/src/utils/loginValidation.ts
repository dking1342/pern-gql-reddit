
type UserCredentials = {
    email: string,
    password: string
}

type FieldError = {
    field:string,
    message:string
}

type ValidationResponse = {
    errorLog?:FieldError[] | [],
    valid?:boolean
}

export const loginValidation = (options:UserCredentials):ValidationResponse => {
    let errorLog:FieldError[] = [];
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    
    if(!options.email.match(regEx)){
        errorLog = [
            ...errorLog,
            {
                field:"email",
                message:"Email must be a vaild email address"
            }
        ]
    }

    if(options.password.length <= 2){
        errorLog = [
            ...errorLog,
            {
                field:"password",
                message:"Password must be at least two characters long"
            }
        ]
    }

    return {
        errorLog,
        valid: Object.keys(errorLog).length < 1
    }
}

