import { OrderClientAdapter } from "../../gateways/orders-client-adapter";
import axios from "axios";
export class OrderClientServiceAdapter implements OrderClientAdapter {
    constructor() {
    }

    async updateStatus(idOrder: number, status: string): Promise<void> {  
        var basePath = process.env.ORDER_MS_HOST 
        var url = basePath + "/ms-orders/api/v1/orders/" + idOrder
        
        await axios.patch(url,{
            status: status
        }).catch((error) => {
            console.error('Error initialize to the database:', error)
            throw error});
    }
}
