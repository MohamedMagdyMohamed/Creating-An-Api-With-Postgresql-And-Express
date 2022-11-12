import Client from '../../database'
import supertest from "supertest";
import { app } from "../../server";
import { User, UserStore } from '../../models/user';
import { createToken } from '../../utils/jwtHelper';

const request = supertest(app);
const userStore = new UserStore();

const testUser = {
    id: 1,
    firstName: "firstName",
    lastName: "lastName",
    password: "password"
};

const testUser2 = {
    id: 2,
    firstName: "firstName",
    lastName: "lastName",
    password: "password"
};

const testUsers = [
    testUser,
    testUser2
];

const token = createToken(testUser.id);

describe("Test users api endpoint responses", (): void => {
    // test empty users table
    it("index gets the api endpoint to be 200 and no body when database empty", async (): Promise<void> => {
        const response = await request.get("/users").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeUndefined;
    });

    // test users table not empty
    it("index gets the api endpoint to be 200 and there is a body", async (): Promise<void> => {
        await userStore.create(testUser);
        await userStore.create(testUser2);
        const response = await request.get("/users").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    // test users get by id
    it("show gets the api endpoint to be 200 there is a body when the user exists", async (): Promise<void> => {
        await userStore.create(testUser);
        const response = await request.get("/users/1").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
    });

    // test users get by id
    it("show gets the api endpoint to be 200 there is an empty body when the user not exists", async (): Promise<void> => {
        const response = await request.get("/users/2").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBe('');
    });
    
    // test create user
    it("create gets the api endpoint to be 200 when the user created successfully", async (): Promise<void> => {
        const response = await request.post("/users").send(testUser);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(String);
    });

    // test delete user by id
    it("delete gets the api endpoint to be 200 when the user deleted successfully", async (): Promise<void> => {
        await userStore.create(testUser);
        const response = await request.delete("/users/1").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    });

    // test login user by firstname and password
    it("login posts the api endpoint to be 200 when the user exists and password match", async (): Promise<void> => {
        await userStore.create(testUser);
        const response = await request.post("/users/login").send({
            firstName: testUser.firstName,
            password: testUser.password
        });
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(String);
    });

    // delete users table after each test
    afterEach(async () => {
        const connection = await Client.connect();
        await connection.query('DELETE from users; \n ALTER sequence users_id_seq restart with 1;');
        connection.release();
    });
});
