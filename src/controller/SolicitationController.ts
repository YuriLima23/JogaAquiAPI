import { Request, Response } from 'express'
import prisma from '../database/index'
import { cpf as CPF } from 'cpf-cnpj-validator';
import { User } from '.prisma/client';
import { checkValue, convertStatusSolicitation } from '../util/validation';
import { EInitialStatus } from '../util/enums';
import { lookForAddress } from '../model/Places';
import { STATUS_CODES } from 'http';

const create = async (req: Request, res: Response) => {
    const { address, number, date, time, type_recicle = [], lng } = req.body
    const user = req.user
    let now = new Date(date)
    now.setTime(time)
    let initial_status = EInitialStatus.Proccessing
    let weight = 0.0
    try {
        console.log('user', now.toLocaleDateString("pt-br"), type_recicle,)
        if (type_recicle.length <= 0 || !checkValue(user)) {
            return res.status(400).json({ msg: "Campos invalidos" })
        }
        const types = await prisma.type_Recicle.findMany({ where: { id: { in: type_recicle } } })
        if (types.length > 0) {
            const resp = await lookForAddress(address, number)
            if (resp) {
                const response = await prisma.solicitation.create({
                    data: {
                        status: initial_status,
                        weight: weight,
                        date_of_collect: now,
                        latitude: parseFloat(resp.lat.toString()),
                        longitude: parseFloat(resp.lng.toString()),
                        address: address,
                        user: {
                            connect: {
                                id: user?.id
                            }
                        }
                    },
                    include: { types_recicles: true }
                })
                let types_recicles_change = types.map((item) => {
                    return { id: item.id }
                })
                const many = await prisma.solicitation.update({
                    where: { id: response.id }, data: {
                        types_recicles: { set: types_recicles_change }
                    }
                })

                return res.status(200).json({ msg: "Dados inseridos com sucesso", })
            }

        }

        return res.status(400).json("solicitation/types-recicles-invalid")

    } catch (error) {
        console.log("Error create solicitation: ", error)
        return res.status(400).json("solicitation/error-create")
    }
}

const list = async (req: Request, res: Response) => {
    try {

        return res.status(200).json({ msg: "Dados inseridos com sucesso", })
    } catch (error) {

        return res.status(400).json({ msg: "Erro ao inserir o usuario" })
    }
}

const listByUser = async (req: Request, res: Response) => {
    try {
        const id_user = req.user?.id
        const response = await prisma.solicitation.findMany({ where: { user: { id: id_user } }, include: { types_recicles: true } })
        console.log('response', response)
        return res.status(200).json(response)
    } catch (error) {
        console.log('error', error)
        return res.status(400).json({ msg: "Erro ao listar solicitacaoes" })
    }
}

const remove = async (req: Request, res: Response) => {
    try {

        return res.status(200).json({ msg: "Dados inseridos com sucesso", })
    } catch (error) {

        return res.status(400).json({ msg: "Erro ao inserir o usuario" })
    }
}
const changeStatusSolicitation = async (req: Request, res: Response) => {
    const { total = 0, weight = 0, reason_refused = "", status, date_collect } = req.body
    const id = parseInt(req.params.id)
    const user_id = req.user?.id
    let custom_total = 0.0;
    let custom_weight = 0.0;
    let custom_status = EInitialStatus.Collect;
    let custom_date = new Date(date_collect)
    let custom_refused = ""
    try {

        if (status == EInitialStatus.Refused) {
            if (!checkValue(reason_refused)) {
                throw "Razão da recusa não foi definida"
            }
        } else {
            if (total == 0 || weight == 0 || !checkValue(date_collect)) {
                throw "Peso ou valor total não foram definidos!"
            }
        }

        switch (status) {
            case EInitialStatus.Finish:
                custom_total = parseFloat(total)
                custom_weight = parseFloat(weight)
                custom_status = EInitialStatus.Finish
                custom_refused = ""
                break
            case EInitialStatus.Proccessing:
                custom_total = 0.0
                custom_weight = 0.0
                custom_status = EInitialStatus.Proccessing
                custom_refused = ""
                break
            case EInitialStatus.Refused:
                custom_total = 0.0
                custom_weight = 0.0
                custom_status = EInitialStatus.Refused
                custom_refused = reason_refused
                break
            default:
                custom_total = 0.0
                custom_weight = 0.0
                custom_status = EInitialStatus.Collect
                custom_refused = ""
                break
        }

        const response = await prisma.solicitation.update({
            data: {
                total: custom_total,
                weight: custom_weight,
                status: custom_status,
                date_of_collect: custom_date,
                reason_refusal: custom_refused
            },
            where: {
                id: id
            },
        })
        let updateWallet =await  updateValuesWallet(user_id)
        if(EInitialStatus.Finish == custom_status && !updateWallet ){
            throw "Erro ao atulizar a carteira do usuario"
        }
       

        return res.status(200).json({ msg: "Dados atualizados com sucesso", })
    } catch (error) {
        console.log("error change status solicitation ", error)
        return res.status(400).json({ msg: error })
    }
}



const update = async (req: Request, res: Response) => {
    const {
        type_recicle = [],
        total = 0.00,
        status = EInitialStatus.Proccessing,
        weight,
        date_of_collect } = req.body
    const solicitation_id = req.params.id
    const user = req.user


    try {
        if (!checkValue(user)) {
            return res.status(400).json({ msg: "Campos invalidos" })
        }

        const types = await prisma.type_Recicle.findMany({ where: { id: { in: type_recicle } } })

        if (types.length > 0) {

            let types_recicles_change = types.map((item) => {
                return { id: item.id }
            })

            const response = await prisma.solicitation.update({
                where: { id: parseInt(solicitation_id) },
                data: {
                    total: total,
                    status: status,
                    weight: parseFloat(weight),
                    date_of_collect: date_of_collect,
                    user: {
                        connect: {
                            id: user?.id
                        }
                    },
                    types_recicles: {
                        set: []
                    }
                },
                include: { types_recicles: true },

            })

            const many = await prisma.solicitation.update({
                where: { id: response.id }, data: {
                    types_recicles: { set: types_recicles_change }
                }
            })

            return res.status(200).json({ msg: "Dados Alterados com sucesso", })
        }

        return res.status(400).json("solicitation/types-recicles-invalid")

    } catch (error) {
        console.log("Error update solicitation: ", error)
        return res.status(400).json("solicitation/error-update")
    }
}

const updateValuesWallet = async (user_id? : string) => {
    let date = new Date()
    let first_day = new Date(date.getFullYear(), date.getMonth(), 1)
    let last_date = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    let total = 0
    try {
        const response = await prisma.solicitation.findMany({
            where: {
                user: {
                    id: user_id
                },
                status:EInitialStatus.Finish,
                cobrado: false,
                createdAt: { gte: first_day, lt: last_date },
            },
        })
        response.forEach((item) => {
            total += item.total || 0
        })

        const resp = await prisma.wallet.findFirst({ where: { user_id: user_id } })
    
        if (!resp) {
            throw "Carteira não encontrada"
        }
        const walletResponse = await prisma.wallet.update({
            where: { id: resp.id }, data: {
                balance: total,
            }
        })

        return true
    } catch (error) {
        console.log("Erro update wallet solicitation ", error)
        return false

    }
}

export default { create, list, remove, listByUser, update, changeStatusSolicitation, updateValuesWallet }