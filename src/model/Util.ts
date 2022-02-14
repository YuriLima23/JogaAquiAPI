import redis from "./Redis"

export const generateCode = (user_id) => {
    try {
        const code = Math.floor(1000 + Math.random() * 9000);
        redis.set(`code:${user_id}`, code)
        return true
    } catch (error) {
        console.log("Erro ao salvar no redis")
        return false
    }

}

export const verifyCode = (user_id) => {
    try {
        const code = Math.floor(1000 + Math.random() * 9000);
        return redis.get(`code:${user_id}`)
    } catch (error) {
        console.log("Erro ao salvar no redis")
        return null
    }
}