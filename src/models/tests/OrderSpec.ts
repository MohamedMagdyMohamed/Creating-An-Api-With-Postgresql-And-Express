import { Order, OrderStore } from '../order';
import { User, UserStore } from '../user';
import Client from '../../database'

const userStore = new UserStore();
const orderStore = new OrderStore();

const testUser = {
    id: 1,
    firstName: "firstName",
    lastName: "lastName",
    password: "password"
};

const testOrder = {
    id: 1,
    status: "active",
    user_id: testUser.id,
};

describe("Order Model", () => {
    // Test that the functions is defined (index, show, create, delete)
    describe("Functions defined", () => {
        // should have an index method
        it('should have an index method', () => {
            expect(orderStore.index).toBeDefined();
        });
    
        // should have an show method
        it('should have a show method', () => {
            expect(orderStore.show).toBeDefined();
        });
    
        // should have an create method
        it('should have a create method', () => {
            expect(orderStore.create).toBeDefined();
        });

        // should have an delete method
        it('should have a delete method', () => {
            expect(orderStore.delete).toBeDefined();
        });
    });

    describe("Test functionallity", () => {
        // should return list of orders
        it('index method should return a list of orders', async () => {
            await userStore.create(testUser);
            await orderStore.create(testOrder);
            const result = await orderStore.index();
            expect(result).toBeInstanceOf(Array);
        });

        // should show a order of a specific id
        it('show method should return specific order', async () => {
            await userStore.create(testUser);
            await orderStore.create(testOrder);
            const result = await orderStore.show(testOrder.id);
            expect(result.id).toEqual(testOrder.id);
        });

        // Should add a new order
        it('create method should add a Order', async () => {
            await userStore.create(testUser);
            const result = await orderStore.create(testOrder);
            expect(result.id).toEqual(testOrder.id);
        });

        // should delete a order of a specific id
        it('delete method should return deleted order', async () => {
            await userStore.create(testUser);
            await orderStore.create(testOrder);
            const result = await orderStore.delete(testOrder.id);
            expect(result).toBeUndefined;
        });

        // delete orders table after each test
        afterEach(async () => {
            const connection = await Client.connect();
            await connection.query('DELETE from orders; \n ALTER sequence orders_id_seq restart with 1;');
            await connection.query('DELETE from users; \n ALTER sequence users_id_seq restart with 1;');
            connection.release();
        });
    });
});
