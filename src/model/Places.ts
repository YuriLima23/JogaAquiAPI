import client from "./Google"


export const lookForAddress = async (address, number) => {
    try {
        let auxAddress = address.split("-")[0].replace(/\d/g,"")
        let neighbors = address.split("-")[1]
        let country = address.split("-")[2]
       
        address = `${auxAddress}, ${number} - ${neighbors} - ${country}`
        console.log(address)
        const response = await client.geocode({params:{
            address:address,
            components:{
                country:"BR"
            }

        }})
        console.log("Resultado :", response.data.results[0].geometry.location)
        if(response.data.results.length <= 0){
            throw "Nenhum endereço encontrado"
        }

        return  response.data.results[0].geometry.location
    } catch (error) {
        console.log("ERRO lookforAddres :", error)
    }

    return null
  
}


