-- Script creacion de tablas 

create database woofandbarf_bd;

use woofandbarf_bd;

create table usuario (
id_usuario int auto_increment primary key,
nombre varchar(50),
apellidos varchar(50), 
email varchar(50),
telefono varchar(50), 
fecha_nacimiento int, 
contrasena varchar(50),
codigo_verificacion varchar(30),
codigo_expiracion timestamp null,
esta_verificado boolean default false
);

create table product (
id_product varchar(20) auto_increment primary key,
product_name varchar(50), 
descripcion varchar(100),
image varchar(500), 
formato_venta varchar(50), 
cantidad_stock int,
tamano varchar(50), 
precio float,
categoria varchar(50), 
descuento float 
);

create table pedido (
id_pedido int auto_increment primary key,
id_usuario int, 
envio_direccion varchar(100),
total_venta float,
numero_rastreador int, 
fecha_creacion time
);

create table pedido_detalle (
id_pedido_detalle int auto_increment primary key,
id_pedido int,
id_producto int,
cantidad int, 
precio float
);

create table formato_producto (
id_formato_venta int auto_increment primary key, 
formato varchar(25)
);

create table cards (
id_card int auto_increment primary key, 
id_user int, 
number_card int,
tipo_card enum('credito', 'debito'),
fecha_expiracion int, 
cvv int
);

create table direccion (
id_direccion int auto_increment primary key, 
id_usuario int, 
direccion varchar(100),
alcaldia varchar(50),
tipo_direccion varchar(50)
);

create table alcaldia (
id_alcaldia int auto_increment primary key,
alcaldia_name varchar(50)
);

create table roles (
id_role int auto_increment primary key, 
rol_pagina varchar(50)
);


create table carrito (
id_carrito int auto_increment primary key, 
id_user int
);

create table carrito_detalle (
id_carrito_detalle int auto_increment primary key, 
id_carrito int,
id_product int, 
cantidad int, 
creacion_carrito date
);

create table categoria (
id_categoria int auto_increment primary key, 
categoria varchar(50)
);

create table review (
id_review int auto_increment primary key, 
id_product int, 
id_user int, 
rating tinyint not null check (rating between 1 and 5), 
comentario varchar(200), 
fecha_review time
)
