import { OrderDTO } from "../../../base/dto/order";
import { Exception, InternalServerErrorException } from "../../../core/entities/exceptions";
import { OrderClientAdapter } from "../../gateways/orders-client-adapter";

export class OrderClientServiceAdapter implements OrderClientAdapter {
    private axios: any;

    constructor() {
        this.axios = require('axios').default;
    }

    async updateStatus(idOrder: number, status: string): Promise<void> {  
        var basePath = process.env.ORDERS_MS_HOST 
        var url = basePath + "/orders/" + idOrder
        
        const response = await this.axios.patch(url,{
            status: status
        });
    }
}
