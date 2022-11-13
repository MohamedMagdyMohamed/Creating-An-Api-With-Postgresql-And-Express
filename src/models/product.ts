import Client from '../database';

// export Product types
export type Product = {
    id?: number;
    name: string;
    price: number;
}

// Export the ProductStore model
export class ProductStore {

    /**
     * Get all products in the database
     * @returns Promise Product array or throw error
     */
    async index(): Promise<Product[]> {
        try {
            const connection = await Client.connect();
            const sql = 'SELECT * FROM products';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get products. Error: ${err}`);
        }
    }
    
    /**
     * Return product information according to its id
     * @param id of the Product to be returened from the database
     * @returns Promise the Product of a specific id or throw error
     */
    async show(id: number): Promise<Product> {
    try {
        const connection = await Client.connect()
        const sql = 'SELECT * FROM products WHERE id=($1)';
        const result = await connection.query(sql, [id]);
        connection.release();
        // return just the first row because the id is unique and the result will return array with one item
        return result.rows[0];
    } catch (err) {
        throw new Error(`Could not find Product ${id}. Error: ${err}`);
    }
    }
    
    /**
     * Create a new record in the database with a product object
     * @param product object to be saved in the database
     * @returns return the saved product object from the database or error
     */
    async create(product: Product): Promise<Product> {
        try {
            const connection = await Client.connect()
            const sql = 'INSERT INTO products(name, price) VALUES($1, $2) RETURNING *';
            const result = await connection.query(sql, [product.name, product.price]);
            const productDb = result.rows[0];
            connection.release();
            return productDb;
        } catch (err) {
            throw new Error(`Could not add new product. Error: ${err}`);
        }
    }

    /**
     * Update the record in the database with a new product object
     * @param product object to be updated in the database
     * @returns return the updated product object from the database or error
     */
     async update(product: Product): Promise<Product> {
        try {
            const connection = await Client.connect()
            const sql = 'UPDATE products SET name=$1, price=$2 WHERE id=$3 RETURNING *';
            const result = await connection.query(sql, [product.name, product.price, product.id]);
            const productDb = result.rows[0];
            connection.release();
            return productDb;
        } catch (err) {
            throw new Error(`Could not add new product. Error: ${err}`);
        }
    }

    /**
     * Delete specific product with its id
     * @returns Promise Product or throw error
     */
    async delete(id: number): Promise<Product> {
        try {
            const connection = await Client.connect();
            const sql = 'DELETE FROM products WHERE id=($1)';
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not delete product. Error: ${err}`);
        }
    }
}