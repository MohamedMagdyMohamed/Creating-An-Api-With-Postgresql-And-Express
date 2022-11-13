import Client from '../../database'
import supertest from "supertest";
import { app } from "../../server";
import { Order, OrderStore } from '../../models/order';
import { createToken } from '../../utils/jwtHelper';
import { UserStore } from '../../models/user';

const request = supertest(app);
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

const testOrder2 = {
    id: 2,
    status: "active",
    user_id: testUser.id,
};

const testOrderes = [
    testOrder,
    testOrder2
];

const token = createToken(1);

describe("Test orders api endpoint responses", (): void => {
    // test empty order table
    it("index gets the api endpoint to be 200 and no body when database empty", async (): Promise<void> => {
        const response = await request.get("/orders").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeUndefined;
    });

    // test orders table not empty
    it("index gets the api endpoint to be 200 and there is a body", async (): Promise<void> => {
        await userStore.create(testUser);
        await orderStore.create(testOrder);
        await orderStore.create(testOrder2);
        const response = await request.get("/orders").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    // test orders get by id
    it("show gets the api endpoint to be 200 there is a body when the order exists", async (): Promise<void> => {
        await userStore.create(testUser);
        await orderStore.create(testOrder);
        const response = await request.get("/orders/1").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
    });

    // test orders get by id
    it("show gets the api endpoint to be 200 there is an empty body when the order not exists", async (): Promise<void> => {
        const response = await request.get("/orders/2").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBe('');
    });
    
    // test create order
    it("create gets the api endpoint to be 200 when the order created successfully", async (): Promise<void> => {
        await userStore.create(testUser);
        const response = await request.post("/orders").send(testOrder).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
    });

    // test delete order by id
    it("delete gets the api endpoint to be 200 when the order deleted successfully", async (): Promise<void> => {
        await userStore.create(testUser);
        await orderStore.create(testOrder);
        const response = await request.delete("/orders/1").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    // test currentOrderByUser order by id
    it("currentOrderByUser gets the api endpoint to be 200 user orders", async (): Promise<void> => {
        await userStore.create(testUser);
        await orderStore.create(testOrder);
        const response = await request.get("/orders/user/1").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    // delete orders table after each test
    afterEach(async () => {
        const connection = await Client.connect();
        await connection.query('DELETE from orders; \n ALTER sequence orders_id_seq restart with 1;');
        await connection.query('DELETE from users; \n ALTER sequence users_id_seq restart with 1;');
        connection.release();
    });
});
