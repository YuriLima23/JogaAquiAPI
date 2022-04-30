import { Request, Response } from 'express'
import prisma from '../database/index'
import { cpf as CPF } from 'cpf-cnpj-validator';
import { User } from '.prisma/client';

const create = async (req: Request, res: Response, next) => {
    try {
       
        return res.status(200).json({ msg: "Dados inseridos com sucesso",  })
    } catch (error) {
       
        return res.status(400).json({ msg: "Erro ao inserir o usuario" })
    }
}

const list = async (req: Request, res: Response, next) => {
    try {
       
        return res.status(200).json({ msg: "Dados inseridos com sucesso",  })
    } catch (error) {
       
        return res.status(400).json({ msg: "Erro ao inserir o usuario" })
    }
}

const remove = async (req: Request, res: Response, next) => {
    try {
       
        return res.status(200).json({ msg: "Dados inseridos com sucesso",  })
    } catch (error) {
       
        return res.status(400).json({ msg: "Erro ao inserir o usuario" })
    }
}





module.exports = { create, list , remove}