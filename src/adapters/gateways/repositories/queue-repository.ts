export interface OrderRepository {
    save(order: FakeQueue): Promise<FakeQueue>
    getById(orderId: number): Promise<FakeQueue | null>
    update(orderId: number, status: string): Promise<void>
    delete(orderId: number): Promise<void>
}