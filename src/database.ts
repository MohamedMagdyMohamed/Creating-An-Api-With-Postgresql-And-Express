import dotenv from 'dotenv';
import { Pool } from 'pg';

// Init the dotenv
dotenv.config();

// get the env variables to be used to init the database
const {
    ENV,
    DB_HOST,
    DB_NAME,
    DB_TEST_NAME,
    DB_USER,
    DB_PASS   
} = process.env;

// client of the database
let client: Pool = new Pool();

// init the client for the test env
if (ENV == 'test') {
  client = new Pool({
    host: DB_HOST,
    database: DB_TEST_NAME,
    user: DB_USER,
    password: DB_PASS
  });
}

// init the client for the dev env
if (ENV == 'dev') {
  client = new Pool({
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASS
  });
}

// export the client database to be used in other part
export default client;
