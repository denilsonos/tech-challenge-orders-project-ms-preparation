import { OrderClientAdapter } from "../../gateways/orders-client-adapter";

export class OrderClientServiceAdapter implements OrderClientAdapter {
    constructor() { }

    async getById(idOrder: number): Promise<any> {
        const axios = require('axios').default;

        try {
            const response = await axios.get("https://api.github.com/users/mapbox");
            console.log(response.data);
            console.log(response.status);
            console.log(response.statusText);
            console.log(response.headers);
            console.log(response.config);
        } catch (error) {
            // Handle error
            console.error(error);
        }
    }
}
