import { User, UserStore } from '../user';
import Client from '../../database'

const userStore = new UserStore()

const testUser = {
    id: 1,
    firstName: "firstName",
    lastName: "lastName",
    password: "password"
};

describe("User Model", () => {
    // Test that the functions is defined (index, show, create, delete)
    describe("Functions defined", () => {
        // should have an index method
        it('should have an index method', () => {
            expect(userStore.index).toBeDefined();
        });
    
        // should have an show method
        it('should have a show method', () => {
            expect(userStore.show).toBeDefined();
        });
    
        // should have an create method
        it('should have a create method', () => {
            expect(userStore.create).toBeDefined();
        });

        // should have an delete method
        it('should have a delete method', () => {
            expect(userStore.delete).toBeDefined();
        });

        // should have an login method
        it('should have a login method', () => {
            expect(userStore.login).toBeDefined();
        });
    });

    describe("Test functionallity", () => {
        // should return list of users
        it('index method should return a list of users', async () => {
            await userStore.create(testUser);
            const result = await userStore.index();
            expect(result).toBeInstanceOf(Array);
        });

        // should show a user of a specific id
        it('show method should return specific user', async () => {
            await userStore.create(testUser);
            const result = await userStore.show(testUser.id);
            expect(result.id).toEqual(testUser.id);
        });

        // Should add a new user
        it('create method should add a User', async () => {
            const result = await userStore.create(testUser);
            expect(result.id).toEqual(testUser.id);
        });

        // should delete a user of a specific id
        it('delete method should return deleted user', async () => {
            await userStore.create(testUser);
            const result = await userStore.delete(testUser.id);
            expect(result).toBeUndefined;
        });

        // should login a user if exists and password correct
        it('login method should return user if the user exists and the password correct', async () => {
            await userStore.create(testUser);
            const result = await userStore.login(testUser.firstName, testUser.password);
            expect(result?.id).toBe(testUser.id);
        });

        // should not login a user if exists and password not correct
        it('login method should return null if the user exists and the password not correct', async () => {
            await userStore.create(testUser);
            const result = await userStore.login(testUser.firstName, "d");
            expect(result).toBe(null);
        });

        // delete users table after each test
        afterEach(async () => {
            const connection = await Client.connect();
            await connection.query('DELETE from users; \n ALTER sequence users_id_seq restart with 1;');
            connection.release();
        });
    });
});
