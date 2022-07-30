import { Request, Response } from 'express'
import prisma from '../database/index'
import { cpf as CPF } from 'cpf-cnpj-validator';
import { User } from '.prisma/client';
import { checkValue } from '../util/validation';


const create = async (req: Request, res: Response) => {
    const user = req.user
    try {
     
        const { subject, description } = req.body

        if(!checkValue(subject) || !checkValue(description) ){
            throw "support/invalid-data"
       }
        
        const support = await prisma.support.create({ data: { 
            message: description,
            subject :subject,
            user:{
                connect:{
                    id:user?.id 
                }
            }
         } })
        return res.status(200).json()
    } catch (error) {
        return res.status(400).json(error)

    }
}


const list = async (req: Request, res: Response, next) => {
    try {
        const response = await prisma.support.findMany()
        return resultSuccess(res, response, '')
    } catch (error) {
        console.log("Teste : ", error)
           error.table = TABLE
        next(error)
    }

}
const getOne = async (req: Request, res: Response, next) => {
    const { id } = req.params
    try {
        const response = await prisma.support.findFirst({ where: { id: parseInt(id) } })
        return resultSuccess(res, response, '')
    } catch (error) {
        console.log("Teste : ", error)
           error.table = TABLE
        next(error)
    }

}


const remove = async (req: Request, res: Response, next) => {
    const { id } = req.params
    try {
        const response = await prisma.support.delete({ where: { id: parseInt(id) } })
        return resultSuccess(res, null, `${TABLE} deletado com sucesso`)
    } catch (error) {
        console.log("Teste : ", error)
        error.table = TABLE
        next(error)
        //    error.table = TABLE
        next(error)
    }
}

const update = async (req: Request, res: Response, next) => {
    const { id } = req.params
    const { message_response, message } = req.body

    try {
        const response = await prisma.support.update({
            where: { id: parseInt(id) },
            data: {
                message_response
            }
        })
        return resultSuccess(res, null, `${TABLE} atualizado com sucesso`)
    } catch (error) {
        console.log("Teste : ", error)
           error.table = TABLE
        next(error)
    }
}

const resultSuccess = (res: Response, data: any, msg: string) => {
    return res.json({ status: 200, data, msg })
}

const generateExeption = (res, error) => {
    console.log("Teste : ", error)
    let msg = ""
    switch (error.code) {
        case 'P2002':
            let errors = []
            let field = error.meta.target
            msg = `Campo ${field} já esta sendo usado`
            return res.status(400).send({ status: 400, msg: msg })
        case 'P2025':
            msg = `Item na ${TABLE} não existe`
            return res.status(400).send({ status: 400, msg: msg })
        case 'P2003':
            msg = "Não foi possivel deletar item, existe referencia"
            return res.status(400).send({ status: 400, msg: msg })


        // erros da aplicação --------------------------------------------------
        case 'E002':
        case 'E003':
            return res.status(400).send({ status: 400, msg: error.msg })
        default:
            return res.status(400).send({ status: 400, msg: "Erro ao realizar a ação" })


    }
}




export = { create, list, remove, update, getOne }