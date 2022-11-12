import Client from '../database'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Init the dotenv
dotenv.config();

// get the env variables to be used to init the database
const {
    BCRYPT_PASSWROD,
    SALT_ROUND
} = process.env;

// export User types
export type User = {
    id?: number;
    firstName: string;
    lastName: string;
    password: string;
}

// Export the userStore model
export class UserStore {

    /**
     * Get all users in the database
     * @returns Promise User array or throw error
     */
    async index(): Promise<User[]> {
        try {
            const connection = await Client.connect();
            const sql = 'SELECT * FROM users';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get users. Error: ${err}`);
        }
      }
    
      /**
       * Return user information according to its id
       * @param id of the user to be returened from the database
       * @returns Promise the user of a specific id or throw error
       */
      async show(id: number): Promise<User> {
        try {
            const connection = await Client.connect()
            const sql = 'SELECT * FROM users WHERE id=($1)';
            const result = await connection.query(sql, [id]);
            connection.release();
            // return just the first row because the id is unique and the result will return only one item in the array
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find user ${id}. Error: ${err}`);
        }
      }
    
      /**
       * Create a new record in the database with a user object
       * @param user object to be saved in the database
       * @returns return the saved user object from the database or error
       */
      async create(user: User): Promise<User> {
          try {
            const connection = await Client.connect()
            // hash the password to be stored in the database
            const hash = bcrypt.hashSync(
                user.password + BCRYPT_PASSWROD, 
                parseInt(SALT_ROUND as unknown as string)
            );
            const sql = 'INSERT INTO users(firstName, lastName, password) VALUES($1, $2, $3) RETURNING *';
            const result = await connection.query(sql, [user.firstName, user.lastName, hash]);
            const userDb = result.rows[0];
            connection.release();
            return userDb;
          } catch (err) {
            throw new Error(`Could not add new user. Error: ${err}`);
          }
    }

    /**
     * Delete specific user with its id
     * @returns Promise User or throw error
     */
    async delete(id: number): Promise<User[]> {
        try {
            const connection = await Client.connect();
            const sql = 'DELETE FROM users WHERE id=($1)';
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not delete user. Error: ${err}`);
        }
    }

    /**
     * Login the user
     * @param firstName of the user to be able to login
     * @param password of the user to be able to login
     * @returns User if the user exists and the password correct or null
     */
    async login(firstName: string, password: string): Promise<User | null> {
        try {
            const connection = await Client.connect();
            const sql = 'SELECT * FROM users WHERE firstname=($1)';
            const result = await connection.query(sql, [firstName]);
            connection.release();
            if (result.rows.length) {
                const user = result.rows[0];
                // check that the hashed password is the same password the user enters
                if (bcrypt.compareSync(password + BCRYPT_PASSWROD, user.password)) {
                    return user;
                }
            }
            return null;
        } catch (err) {
            throw new Error(`Could not login user. Error: ${err}`);
        }
    }
}
