declare namespace Express {
    export interface Request {
        user?: {
            email?: string,
            token_auth?: string,
            id?: string,
            name?: string,
            phone?: string,
            cpf?: string
        }
    }
}
