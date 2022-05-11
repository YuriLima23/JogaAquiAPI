import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({
    config: {
        params: {
            key: process.env.GOOGLE_MAPS_API_KEY,
        }
    }
})

export default client