const Redis = require("redis")


const getClient = async () =>{
    try {
        const client = Redis.createClient(process.env.REDIS_URL);
        await client.connect()  
        return client
    } catch (error) {
        console.log("Erro ao conectar no redis ");
        return null
    }
}

export default  getClient()