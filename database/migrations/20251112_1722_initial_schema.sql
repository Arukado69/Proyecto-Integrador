-- Script creacion de tablas 

create database woofandbarf_bd;

use woofandbarf_bd;

create table usuario (
ID_usuario int auto_increment primary key,
nombre varchar(50),
apellidos varchar(50), 
email varchar(50),
telefono varchar(50), 
fecha_nacimiento int, 
contrasena varchar(50)
);

create table product (
ID_product varchar(20) auto_increment primary key,
product_name varchar(50), 
descripcion varchar(100),
imagen mediumblob, 
formato_venta varchar(50), 
cantidad_stock int,
tamano varchar(50), 
precio float,
categoria varchar(50), 
descuento float 
);

create table pedido (
ID_pedido int auto_increment primary key,
ID_user int, 
envio_direccion varchar(100),
total_venta float,
numero_rastreador int, 
fecha_creacion time
);

create table pedido_detalle (
ID_pedido_detalle int auto_increment primary key,
ID_pedido int,
ID_producto int,
cantidad int, 
precio float
);
