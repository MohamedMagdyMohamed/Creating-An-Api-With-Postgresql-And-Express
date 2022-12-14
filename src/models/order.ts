import Client from '../database';
import { Product } from './product';
import { User } from './user';

// export Order types
export type Order = {
    id?: number;
    status: string;
    user_id: number;
}

// export UserOrder types
export type UserOrder = {
    orders: Order[],
}

// Export the OrderStore model
export class OrderStore {

    /**
     * Get all Orders in the database
     * @returns Promise Order array or throw error
     */
    async index(): Promise<Order[]> {
        try {
            const connection = await Client.connect();
            const sql = 'SELECT * FROM orders';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get orders. Error: ${err}`);
        }
    }
    
    /**
     * Return Order information according to its id
     * @param id of the Order to be returened from the database
     * @returns Promise the Order of a specific id or throw error
     */
    async show(id: number): Promise<Order> {
        try {
            const connection = await Client.connect()
            const sql = 'SELECT * FROM orders WHERE id=($1)';
            const result = await connection.query(sql, [id]);
            connection.release();
            // return just the first row because the id is unique and the result will return array with one item
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find Order ${id}. Error: ${err}`);
        }
    }
    
    /**
     * Create a new record in the database with a Order object
     * @param order object to be saved in the database
     * @returns return the saved Order object from the database or error
     */
    async create(order: Order): Promise<Order> {
        try {
            const connection = await Client.connect()
            const sql = 'INSERT INTO orders(status, user_id) VALUES($1, $2) RETURNING *';
            const result = await connection.query(sql, [order.status, order.user_id]);
            const orderDb = result.rows[0];
            connection.release();
            return orderDb;
        } catch (err) {
            throw new Error(`Could not add new order. Error: ${err}`);
        }
    }

    /**
     * Delete specific Order with its id
     * @returns Promise Order or throw error
     */
    async delete(id: number): Promise<Order> {
        try {
            const connection = await Client.connect();
            const sql = 'DELETE FROM orders WHERE id=($1)';
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not delete order. Error: ${err}`);
        }
    }

    /**
     * Return Order information according to user id
     * @param userId of the user associated to the order to be returened from the database
     * @returns Promise the Order of a specific id or throw error
     */
     async currentOrderByUser(userId: number): Promise<UserOrder> {
        try {
            const connection = await Client.connect()
            const ordersSql = "json_agg((SELECT x FROM (SELECT o.id, o.status) AS x)) AS orders";
            const sql = 'SELECT ' + ordersSql + ' FROM orders AS o INNER JOIN users as u ON o.user_id = u.id WHERE u.id = $1 GROUP BY u.id';
            const result = await connection.query(sql, [userId]);
            connection.release();
            // return just the first row because the id is unique and the result will return array with one item
            const userOrder = result.rows[0];
            console.log("userOrder : " + JSON.stringify(userOrder));
            return userOrder;
        } catch (err) {
            console.log("err : " + err);
            throw new Error(`Could not find UserOrder ${userId}. Error: ${userId}`);
        }
    }
}
