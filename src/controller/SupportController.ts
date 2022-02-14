import { Request, Response } from 'express'
import prisma from '../database/index'
import { cpf as CPF } from 'cpf-cnpj-validator';
import { User } from '.prisma/client';

let TABLE = "Support"
let FK = "USUARIO"
const create = async (req: Request, res: Response, next) => {
    try {
        const { user_id } = req.params
        const { message } = req.body

        if (!message || !user_id) {
            throw { code: "E001", msg: "Campos invalidos!" }
        }
        const user = await prisma.user.findFirst({ where: { id: parseInt(user_id) } })
        if (!user) {
            throw { code: "E003", msg: `Tabela ${FK} não encontrada` }
        }
        const support = await prisma.support.create({ data: { message, user: user.id, message_response: "" } })
        return resultSuccess(res, null, "Mensagem de suporte criada com sucesso")
    } catch (error) {
           error.table = TABLE
        next(error)
    }
}


const list = async (req: Request, res: Response, next) => {
    try {
        const response = await prisma.support.findMany()
        return resultSuccess(res, response, '')
    } catch (error) {
        console.log(error)
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
        console.log(error)
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
        console.log(error)
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
        console.log(error)
           error.table = TABLE
        next(error)
    }
}

const resultSuccess = (res: Response, data: any, msg: string) => {
    return res.json({ status: 200, data, msg })
}

const generateExeption = (res, error) => {
    console.log(error)
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