-- 1. Tạo database
CREATE DATABASE IF NOT EXISTS iotdb;
USE iotdb;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(45),
    last_name VARCHAR(45),
    phone INT,
    avatar varchar(500),
    role enum('ADMIN', 'CUSTOMER') not null,
    expo_token varchar(255),
    created_at DATETIME
);

CREATE TABLE warehouse(
	warehouse_id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) not null,
    temperature float not null
);

CREATE TABLE devices (
	device_id int auto_increment primary key,
    user_id int,
    device_name varchar(50),
    device_code varchar(50) unique,
    warehouse_id int,
    foreign key (warehouse_id) references warehouse(warehouse_id) on delete cascade,
    foreign key (user_id) references users(user_id) on delete set null
);


CREATE TABLE env_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    temperature FLOAT,
    humidity FLOAT,
    device_id int,
    timestamp DATETIME,
    foreign key (device_id) references devices(device_id) on delete set null
);



