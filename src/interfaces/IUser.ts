import { Request } from "express"

interface IUserRequest extends Request{
    user : {
        email? : string,
        token_auth?: string,
        id? : string,
        name? : string, 
        phone? : string,
        cpf? : string
    }
}