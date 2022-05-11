
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { decode } from "punycode"
import prisma from "../database"

const verifyToken = (req : Request, res: Response, next : NextFunction) => {
    const authorization = req.headers.authorization?.split(" ")[1].replace(/\"/g, "")
    console.log("AUTHORIZATION : ", authorization )
    console.log("TOKEN  : ", process.env.SECRET_JWT)
    try {
        if (!authorization) {
            return res.status(401).json("auth/session-expired")
        }
        jwt.verify(authorization,  process.env.SECRET_JWT, async (err, decoded) => {
            if (err){
                console.log(err)
                return res.status(401).json("auth/token_invalid");
            } 
            let user = decoded?.user
            console.log("TOKENUSER : ",decoded )
            const response = await prisma.user.findFirst({where:{id : user.id}})

            if(response?.token_auth != authorization){
                return res.status(401).json("auth/session-expired");
            }
            
            // se tudo estiver ok, salva no request para uso posterior
            req.user = decoded?.user
            next();
          });


    } catch (error) {
        console.log("Erro jWT TOKEN : ", error)
        return res.status(401).json("auth/session-expired");
    }

}

export default verifyToken