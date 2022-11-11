/* Replace with your SQL commands */
/**
** This file will be use to create a Order-Details table as up migration
** Has a foreign key reference to the orders tabel id column
** Has a foreign key reference to the products tabel id column
**/
CREATE TABLE order_details (id SERIAL PRIMARY KEY, quantity INTEGER, product_id INTEGER NOT NULL, FOREIGN KEY(product_id) REFERENCES products(id), order_id INTEGER NOT NULL, FOREIGN KEY(order_id) REFERENCES orders(id));
