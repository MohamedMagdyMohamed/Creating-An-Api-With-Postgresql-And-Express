import Client from '../../database'
import supertest from "supertest";
import { app } from "../../server";
import { Product, ProductStore } from '../../models/product';
import { createToken } from '../../utils/jwtHelper';

const request = supertest(app);
const productStore = new ProductStore();

const testProduct = {
    id: 1,
    name: "name",
    price: 13.2
};

const testProduct2 = {
    id: 2,
    name: "name2",
    price: 131.2
};

const testProducts = [
    testProduct,
    testProduct2
];

const token = createToken(1);

describe("Test products api endpoint responses", (): void => {
    // test empty product table
    it("index gets the api endpoint to be 200 and no body when database empty", async (): Promise<void> => {
        const response = await request.get("/products");
        expect(response.status).toBe(200);
        expect(response.body).toBeUndefined;
    });

    // test products table not empty
    it("index gets the api endpoint to be 200 and there is a body", async (): Promise<void> => {
        await productStore.create(testProduct);
        await productStore.create(testProduct2);
        const response = await request.get("/products");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    // test products get by id
    it("show gets the api endpoint to be 200 there is a body when the product exists", async (): Promise<void> => {
        await productStore.create(testProduct);
        const response = await request.get("/products/1");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
    });

    // test products get by id
    it("show gets the api endpoint to be 200 there is an empty body when the product not exists", async (): Promise<void> => {
        const response = await request.get("/products/2").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBe('');
    });
    
    // test create product
    it("create gets the api endpoint to be 200 when the product created successfully", async (): Promise<void> => {
        const response = await request.post("/products").send(testProduct).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
    });

    // test delete product by id
    it("delete gets the api endpoint to be 200 when the product deleted successfully", async (): Promise<void> => {
        await productStore.create(testProduct);
        const response = await request.delete("/products/1").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    // test update product
    it("update products the api endpoint to be 200 when the product updated", async (): Promise<void> => {
        await productStore.create(testProduct);
        const response = await request.patch("/products").send({
            name: testProduct2.name,
            price: testProduct2.price
        }).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(String);
    });

    // delete products table after each test
    afterEach(async () => {
        const connection = await Client.connect();
        await connection.query('DELETE from products; \n ALTER sequence products_id_seq restart with 1;');
        connection.release();
    });
});
