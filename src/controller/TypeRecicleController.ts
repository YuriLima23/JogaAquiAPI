import { Request, Response } from 'express'
import prisma from '../database/index'
import { checkValue } from '../util/validation';

const create = async (req: Request, res: Response) => {
    const { price, color, name } = req.body
    try {

        if (!checkValue(price) || !checkValue(color) || !checkValue(name)) {
            return res.status(400).json({ msg: "Campos invalidos!" })
        }

        const response = await prisma.type_Recicle.create({ data: { name, price, color } })

        return res.status(200).json({ msg: "Dados inseridos com sucesso", })
    } catch (error) {
        console.log("Error create type_recicle : ", error)
        return res.status(400).json({ msg: "Erro ao inserir o Type Recicle" })
    }
}

const list = async (req: Request, res: Response) => {
    try {
        const response = await prisma.type_Recicle.findMany()
        console.log(response)
        return res.status(200).json(response)
    } catch (error) {

        return res.status(400).json({ msg: "Erro ao inserir o usuario" })
    }
}

const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if(!checkValue(id)){
            return res.status(400).json({ msg: "Erro ao remover tipo de reciclavel" })
        }

        const response = await prisma.type_Recicle.delete({where:{id: parseInt(id)}})

        return res.status(200).json({ msg: "Type_recicle removido com sucesso", })
    } catch (error) {
        console.log('Error delete type_recicles :', error)
        return res.status(400).json({ msg: "Erro ao inserir o usuario" })
    }
}





export default { create, list, remove }