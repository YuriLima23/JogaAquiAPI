import {Request , Response } from 'express'
import prisma from '../database/index'
import { cpf as CPF } from 'cpf-cnpj-validator'; 
import { User } from '.prisma/client';




// const AAAA = async (req : Request , res: Response) =>{
//     try {
      

//         const response = await prisma.user.create({data:{name, email, cpf: new_cpf, photo, password, type_user}})
//         return resultSuccess(res, "Usuario criado com sucesso")
//     } catch (error) {
//         console.log(error)
//         return resultError(res, 400, error)
//     }

// }

const create = async (req : Request , res: Response) =>{
    try {
        const {name, email, cpf, password, photo, type_user = 1} = req.body
        let new_cpf = removeDotCpf(cpf)

        if(!name || !email || !cpf || !password || !photo){
            throw "Alguns campos estão invalidos, verifique e tente novamente!"
        }
        
        if(!CPF.isValid(new_cpf)){
            throw "CPF Invalido!"
        }

        const response = await prisma.user.create({data:{name, email, cpf: new_cpf, photo, password, type_user}})
        return resultSuccess(res, null, "Usuario criado com sucesso")
    } catch (error) {
        console.log(error)
        return resultError(res, 400, error)
    }

}



const list = async (req : Request , res: Response) =>{
    try {
      

        const response = await prisma.user.findMany(
            {
                select:{
                    id: true, 
                    cpf:true,
                    email:true, 
                    name:true, 
                    photo:true,
                    phone:true,

                 }})
        
        return resultSuccess(res, response, '')
    } catch (error) {
        console.log(error)
        return resultError(res, 400, error)
    }

}

const resultError = (res: Response, status : number , msg: string  ) => {
    return res.json({status , msg})
}

const resultSuccess = (res: Response,data: any ,msg: string) => {
    return res.json({status : 200, data, msg})
}

const removeDotCpf = (cpf) => {
    cpf = cpf.split('.').join("")
    cpf = cpf.split('-').join("")
    return cpf 
}



export = {create, list}