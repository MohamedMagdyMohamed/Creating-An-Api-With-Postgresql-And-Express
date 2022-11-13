import Client from '../database';

// export OrderDetail types
export type OrderDetail = {
    id?: number;
    quantity: number;
    product_id: number;
    order_id: number
}

// Export the OrderDetailStore model
export class OrderDetailStore {

    /**
     * Get all OrderDetails in the database
     * @returns Promise OrderDetails array or throw error
     */
    async index(): Promise<OrderDetail[]> {
        try {
            const connection = await Client.connect();
            const sql = 'SELECT * FROM order_details';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get OrderDetails. Error: ${err}`);
        }
    }
    
    /**
     * Return OrderDetail information according to its id
     * @param id of the OrderDetail to be returened from the database
     * @returns Promise the OrderDetail of a specific id or throw error
     */
    async show(id: number): Promise<OrderDetail> {
    try {
        const connection = await Client.connect()
        const sql = 'SELECT * FROM order_details WHERE id=($1)';
        const result = await connection.query(sql, [id]);
        connection.release();
        // return just the first row because the id is unique and the result will return array with one item
        return result.rows[0];
    } catch (err) {
        throw new Error(`Could not find OrderDetail ${id}. Error: ${err}`);
    }
    }
    
    /**
     * Create a new record in the database with a OrderDetail object
     * @param orderDetail object to be saved in the database
     * @returns return the saved OrderDetail object from the database or error
     */
    async create(orderDetail: OrderDetail): Promise<OrderDetail> {
        try {
            const connection = await Client.connect()
            const sql = 'INSERT INTO order_details(quantity, product_id, order_id) VALUES($1, $2, $3) RETURNING *';
            const result = await connection.query(sql, [orderDetail.quantity, orderDetail.product_id, orderDetail.order_id]);
            const orderDetailDb = result.rows[0];
            connection.release();
            return orderDetailDb;
        } catch (err) {
            throw new Error(`Could not add new orderDetail. Error: ${err}`);
        }
    }

    /**
     * Delete specific OrderDetail with its id
     * @returns Promise OrderDetail or throw error
     */
    async delete(id: number): Promise<OrderDetail> {
        try {
            const connection = await Client.connect();
            const sql = 'DELETE FROM order_details WHERE id=($1)';
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not delete orderDetail. Error: ${err}`);
        }
    }
}
