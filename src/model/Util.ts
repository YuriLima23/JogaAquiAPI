import Redis from "./Redis"

export const generateCode = async (user_id) => {
    try {
        let redis = await Redis()
        const code = Math.floor(1000 + Math.random() * 9000);
        redis.set(`code:${user_id}`, code)
        return true
    } catch (error) {
        console.log("Erro ao salvar no redis", error)
        return false
    }

}

export const setRedis = async (key, value, options) => {
    try {
        let redis = await Redis()
        redis.set(key, value, options)
        redis.quit()
        return true
    } catch (error) {
        console.log("Erro ao salvar no redis", error)
        return false
    }
}

export const getRedis = async (key) => {
    try {
        let redis = await Redis()
        let result = redis.get(key)
        redis.quit()
        return result
    } catch (error) {
        console.log("Erro ao salvar no redis", error)
        return ""
    }
}

export const getAllRedis = async () => {
    try {
        let redis = await Redis()
        let result = await redis.KEYS("*")
       // redis.quit()
        return result
    } catch (error) {
        console.log("Erro ao salvar no redis", error)
        return ""
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