/* Replace with your SQL commands */
/**
** This file will be use to create a Products table as up migration
**/
CREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(100), price FLOAT, password CHAR(60));
