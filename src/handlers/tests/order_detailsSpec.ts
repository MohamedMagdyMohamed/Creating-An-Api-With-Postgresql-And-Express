import Client from '../../database'
import supertest from "supertest";
import { app } from "../../server";
import { Order, OrderStore } from '../../models/order';
import { createToken } from '../../utils/jwtHelper';
import { UserStore } from '../../models/user';
import { ProductStore } from '../../models/product';
import { OrderDetailStore } from '../../models/order_detail';

const request = supertest(app);

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

const token = createToken(1);

describe("Test orders api endpoint responses", (): void => {
    // test empty orderDetail table
    it("index gets the api endpoint to be 200 and no body when database empty", async (): Promise<void> => {
        const response = await request.get("/order_details").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeUndefined;
    });

    // test orderDetails table not empty
    it("index gets the api endpoint to be 200 and there is a body", async (): Promise<void> => {
        await userStore.create(testUser);
        await productStore.create(testProdcut);
        await orderStore.create(testOrder);
        await orderDetailStore.create(testOrderDetail);
        const response = await request.get("/order_details").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    // test orderDetails get by id
    it("show gets the api endpoint to be 200 there is a body when the orderDetail exists", async (): Promise<void> => {
        await userStore.create(testUser);
        await productStore.create(testProdcut);
        await orderStore.create(testOrder);
        await orderDetailStore.create(testOrderDetail);
        const response = await request.get("/order_details/1").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
    });

    // test orderDetails get by id
    it("show gets the api endpoint to be 200 there is an empty body when the orderDetail not exists", async (): Promise<void> => {
        const response = await request.get("/order_details/2").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBe('');
    });
    
    // test create orderDetail
    it("create gets the api endpoint to be 200 when the orderDetail created successfully", async (): Promise<void> => {
        await userStore.create(testUser);
        await productStore.create(testProdcut);
        await orderStore.create(testOrder);
        await orderDetailStore.create(testOrderDetail);
        const response = await request.post("/order_details").send(testOrderDetail).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
    });

    // test delete orderDetail by id
    it("delete gets the api endpoint to be 200 when the orderDetail deleted successfully", async (): Promise<void> => {
        await userStore.create(testUser);
        await productStore.create(testProdcut);
        await orderStore.create(testOrder);
        await orderDetailStore.create(testOrderDetail);
        const response = await request.delete("/order_details/1").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    // delete orders table after each test
    afterEach(async () => {
        const connection = await Client.connect();
        await connection.query('DELETE from order_details; \n ALTER sequence order_details_id_seq restart with 1;');
        await connection.query('DELETE from products; \n ALTER sequence products_id_seq restart with 1;');
        await connection.query('DELETE from orders; \n ALTER sequence orders_id_seq restart with 1;');
        await connection.query('DELETE from users; \n ALTER sequence users_id_seq restart with 1;');
        connection.release();
    });
});
