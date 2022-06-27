import { EInitialStatus } from "./enums"

export const checkValue = (value: any) => {
    if (value == "" || value == undefined || value == null) {
        return false
    }
    return true

}

export const convertStatusSolicitation = (value: any) => {
    switch (value) {
        case EInitialStatus.Collect:
            return EInitialStatus.Collect
        case EInitialStatus.Finish:
            return EInitialStatus.Finish
        case EInitialStatus.Proccessing:
            return EInitialStatus.Proccessing
        case EInitialStatus.Refused:
            return EInitialStatus.Refused
        default:
            return EInitialStatus.Collect
    }
}

