import { Order, OrderStore } from '../order';
import { User, UserStore } from '../user';
import Client from '../../database'
import { ProductStore } from '../product';
import { OrderDetail, OrderDetailStore } from '../order_detail';

const userStore = new UserStore();
const orderStore = new OrderStore();
const productStore = new ProductStore();
const orderDetailStore = new OrderDetailStore();

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

const testProdcut = {
    id: 1,
    name: "name",
    price: 12.3,
};

const testOrderDetail = {
    id: 1,
    quantity: 1,
    product_id: testProdcut.id,
    order_id: testOrder.id
};

describe("OrderDetail Model", () => {
    // Test that the functions is defined (index, show, create, delete)
    describe("Functions defined", () => {
        // should have an index method
        it('should have an index method', () => {
            expect(orderDetailStore.index).toBeDefined();
        });
    
        // should have an show method
        it('should have a show method', () => {
            expect(orderDetailStore.show).toBeDefined();
        });
    
        // should have an create method
        it('should have a create method', () => {
            expect(orderDetailStore.create).toBeDefined();
        });

        // should have an delete method
        it('should have a delete method', () => {
            expect(orderDetailStore.delete).toBeDefined();
        });
    });

    describe("Test functionallity", () => {
        // should return list of orderDetails
        it('index method should return a list of orderDetails', async () => {
            await userStore.create(testUser);
            await productStore.create(testProdcut);
            await orderStore.create(testOrder);
            await orderDetailStore.create(testOrderDetail);
            const result = await orderDetailStore.index();
            expect(result).toBeInstanceOf(Array);
        });

        // should show a orderDetail of a specific id
        it('show method should return specific orderDetail', async () => {
            await userStore.create(testUser);
            await productStore.create(testProdcut);
            await orderStore.create(testOrder);
            await orderDetailStore.create(testOrderDetail);
            const result = await orderDetailStore.show(testOrderDetail.id);
            expect(result.id).toEqual(testOrderDetail.id);
        });

        // Should add a new orderDetail
        it('create method should add a OrderDetail', async () => {
            await userStore.create(testUser);
            await productStore.create(testProdcut);
            await orderStore.create(testOrder);
            const result = await orderDetailStore.create(testOrderDetail);
            expect(result.id).toEqual(testOrderDetail.id);
        });

        // should delete a orderDetail of a specific id
        it('delete method should return deleted orderDetail', async () => {
            await userStore.create(testUser);
            await productStore.create(testProdcut);
            await orderStore.create(testOrder);
            await orderDetailStore.create(testOrderDetail);
            const result = await orderDetailStore.delete(testOrderDetail.id);
            expect(result).toBeUndefined;
        });

        // delete orderDeatilss table after each test
        afterEach(async () => {
            const connection = await Client.connect();
            await connection.query('DELETE from order_details; \n ALTER sequence order_details_id_seq restart with 1;');
            await connection.query('DELETE from products; \n ALTER sequence products_id_seq restart with 1;');
            await connection.query('DELETE from orders; \n ALTER sequence orders_id_seq restart with 1;');
            await connection.query('DELETE from users; \n ALTER sequence users_id_seq restart with 1;');
            connection.release();
        });
    });
});
