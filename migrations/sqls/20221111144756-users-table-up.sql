/* Replace with your SQL commands */
/**
** This file will be use to create a Users table as up migration
** The password set to 60 as the token jwt is a 60 char lenght
**/
CREATE TABLE users (id SERIAL PRIMARY KEY, firstName VARCHAR(100), lastName VARCHAR(100), password CHAR(60));
