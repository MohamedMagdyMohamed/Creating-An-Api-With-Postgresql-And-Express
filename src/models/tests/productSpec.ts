import { Product, ProductStore } from '../product';
import Client from '../../database'

const productStore = new ProductStore();

const testProdcut = {
    id: 1,
    name: "name",
    price: 12.3,
};

describe("Product Model", () => {
    // Test that the functions is defined (index, show, create, delete)
    describe("Functions defined", () => {
        // should have an index method
        it('should have an index method', () => {
            expect(productStore.index).toBeDefined();
        });
    
        // should have an show method
        it('should have a show method', () => {
            expect(productStore.show).toBeDefined();
        });
    
        // should have an create method
        it('should have a create method', () => {
            expect(productStore.create).toBeDefined();
        });

        // should have an delete method
        it('should have a delete method', () => {
            expect(productStore.delete).toBeDefined();
        });

        // should have an update method
        it('should have a update method', () => {
            expect(productStore.update).toBeDefined();
        });
    });

    describe("Test functionallity", () => {
        // should return list of products
        it('index method should return a list of products', async () => {
            await productStore.create(testProdcut);
            const result = await productStore.index();
            expect(result).toBeInstanceOf(Array);
        });

        // should show a product of a specific id
        it('show method should return specific product', async () => {
            await productStore.create(testProdcut);
            const result = await productStore.show(testProdcut.id);
            expect(result.id).toEqual(testProdcut.id);
        });

        // Should add a new product
        it('create method should add a Product', async () => {
            const result = await productStore.create(testProdcut);
            expect(result.id).toEqual(testProdcut.id);
        });

        // should delete a product of a specific id
        it('delete method should return deleted product', async () => {
            await productStore.create(testProdcut);
            const result = await productStore.delete(testProdcut.id);
            expect(result).toBeUndefined;
        });

        // should login a product if exists and password correct
        it('update method should return product if the product updated', async () => {
            await productStore.create(testProdcut);
            testProdcut.name = "f"
            const result = await productStore.update(testProdcut);
            expect(result?.name).toBe(testProdcut.name);
        });

        // delete products table after each test
        afterEach(async () => {
            const connection = await Client.connect();
            await connection.query('DELETE from products; \n ALTER sequence products_id_seq restart with 1;');
            connection.release();
        });
    });
});
