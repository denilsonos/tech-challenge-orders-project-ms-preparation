import { OrderClientServiceAdapter } from "./order-client";
import { OrderStatus } from "../../../core/entities/enums/order-status";
import axios from "axios";
import MockAdapter from "axios-mock-adapter"

describe('OrderClient', () => {
    var axiosMock = new MockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.ORDERS_MS_HOST = "http://localhost/test"
    });

    describe('updateStatus', () => {
       it('should update status with success', async () => {
            const orderClient = new OrderClientServiceAdapter();
            axiosMock.onPatch("http://localhost/test/orders/"+"1").reply(200);
            await orderClient.updateStatus(1, OrderStatus.Created)
        });

        it('should update status with success', async () => {
            const orderClient = new OrderClientServiceAdapter();
            axiosMock.onPatch("http://localhost/test/orders/"+"2").reply(404);
            
            try{
                await orderClient.updateStatus(2, OrderStatus.Created)
            }catch(error){
                expect((error as any).message).toEqual("Request failed with status code 404");
            }
        });
    });
})