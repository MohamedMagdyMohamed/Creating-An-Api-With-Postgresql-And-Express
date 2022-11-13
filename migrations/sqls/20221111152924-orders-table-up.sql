/* Replace with your SQL commands */
/**
** This file will be use to create a Orders table as up migration
** The status of the order can be (active or complete)
** Has a foreign key reference to the users tabel id column
**/
CREATE TABLE orders (id SERIAL PRIMARY KEY, status VARCHAR(10), user_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id));
