-- Script creacion de tablas 

create database woofandbarf_bd;

use woofandbarf_bd;

-- tabla usuario
create table usuario (
id_usuario int auto_increment primary key,
nombre varchar(50) not null,
apellidos varchar(50) not null, 
email varchar(50) not null,
telefono varchar(50) not null, 
fecha_nacimiento date, 
contrasena varchar(50) not null,
codigo_verificacion varchar(30) not null,
codigo_expiracion timestamp not null,
esta_verificado boolean not null default false,
id_rol int not null
);

-- tabla formato producto
create table formato_producto (
id_formato_producto int auto_increment primary key, 
formato varchar(25) not null
);

-- tabla categoria
create table categoria (
id_categoria int auto_increment primary key, 
categoria varchar(100) not null unique
);

-- tabla producto
create table producto (
id_producto varchar(50) primary key,
nombre_producto varchar(50) not null, 
descripcion text not null,
imagen varchar(500) not null, 
id_formato_producto int not null, 
cantidad_stock int not null default 0,
tamano varchar(50) not null, 
precio decimal(10,2) not null,
id_categoria int not null, 
descuento decimal(5,2) not null
);

-- tabla pedido
create table pedido (
id_pedido int auto_increment primary key,
id_usuario int not null, 
direccion_envio varchar(100) not null,
total_venta decimal(10,2) not null,
numero_rastreador varchar(50) not null, 
fecha_creacion datetime default now()
);

-- tabla pedido detalle
create table pedido_detalle (
id_pedido_detalle int auto_increment primary key,
id_pedido int not null,
id_producto varchar(50) not null,
cantidad int not null check(cantidad > 0), 
precio decimal(10,2) not null check (precio >= 0)
);

-- tabla alcaldia
create table alcaldia (
id_alcaldia int auto_increment primary key,
alcaldia_nombre varchar(50) not null,
ubicacion ENUM('Norte', 'Sur', 'Este', 'Oeste', 'Centro')
);

-- tabla direccion
create table direccion (
id_direccion int auto_increment primary key, 
id_usuario int not null, 
id_alcaldia int not null,
direccion varchar(100) not null,
tipo_direccion varchar(50) not null
);

-- tabla tarjeta
create table tarjeta (
id_tarjeta int auto_increment primary key, 
id_usuario int not null, 
numero_tarjeta varchar(20) not null,
tipo_card enum('credito', 'debito') not null,
fecha_expiracion varchar(5) not null, 
cvv varchar(4) not null
);

-- tabla carrito
create table carrito (
id_carrito int auto_increment primary key, 
id_usuario int not null
);

-- tabla carrito detalle 
create table carrito_detalle (
id_carrito_detalle int auto_increment primary key, 
id_carrito int not null,
id_producto varchar(50) not null, 
cantidad int not null check (cantidad > 0), 
creacion_carrito datetime not null
);

-- tabla review
create table review (
id_review int auto_increment primary key, 
id_producto varchar(50) not null, 
id_usuario int not null, 
rating tinyint unsigned not null check (rating between 1 and 5), 
comentario varchar(500) not null, 
fecha_review datetime not null
);

-- tabla roles
create table roles (
id_rol int auto_increment primary key, 
rol_pagina varchar(50) not null
);



-- AGREGAR FK 

-- FK usuario_roles
ALTER TABLE usuario
ADD CONSTRAINT fk_usuario_roles
FOREIGN KEY (id_rol)
REFERENCES roles(id_rol);

-- FK pedido_usuario
ALTER TABLE pedido
ADD CONSTRAINT fk_pedido_usuario
FOREIGN KEY (id_usuario)
REFERENCES usuario(id_usuario)
ON DELETE CASCADE;

-- FK pedido_detalle_pedido
ALTER TABLE pedido_detalle
ADD CONSTRAINT fk_pedido_detalle_pedido
FOREIGN KEY (id_pedido)
REFERENCES pedido(id_pedido);

-- FK / pedido_detalle_producto
ALTER TABLE pedido_detalle
ADD CONSTRAINT fk_pedido_detalle_producto
FOREIGN KEY (id_producto)
REFERENCES producto(id_producto);

-- FK direccion_usuario
ALTER TABLE direccion
ADD CONSTRAINT fk_direccion_usuario
FOREIGN KEY (id_usuario)
REFERENCES usuario(id_usuario)
ON DELETE CASCADE;

-- FK direccion_alcaldia
ALTER TABLE direccion
ADD CONSTRAINT fk_direccion_alcaldia
FOREIGN KEY (id_alcaldia)
REFERENCES alcaldia(id_alcaldia);

-- FK tarjeta_usuario
ALTER TABLE tarjeta
ADD CONSTRAINT fk_tarjeta_usuario
FOREIGN KEY (id_usuario)
REFERENCES usuario(id_usuario)
ON DELETE CASCADE;

-- FK carrito_usuario
ALTER TABLE carrito
ADD CONSTRAINT fk_carrito_usuario
FOREIGN KEY (id_usuario)
REFERENCES usuario(id_usuario)
ON DELETE CASCADE;

-- FK carrito_detalle_carrito
ALTER TABLE carrito_detalle
ADD CONSTRAINT fk_carrito_detalle_carrito
foreign key (id_carrito)
references carrito(id_carrito);

-- FK carrito_detalle_producto
ALTER TABLE carrito_detalle
ADD CONSTRAINT fk_carrito_detalle_producto
foreign key (id_producto)
references producto(id_producto);

 -- FK review_usuario
ALTER TABLE review
ADD CONSTRAINT fk_review_usuario
FOREIGN KEY (id_usuario)
REFERENCES usuario(id_usuario)
ON DELETE CASCADE;

-- FK review_producto
ALTER TABLE review
ADD CONSTRAINT fk_review_producto
FOREIGN KEY (id_producto)
REFERENCES producto(id_producto)
ON DELETE CASCADE;

-- FK producto_formato_producto
ALTER TABLE producto
ADD CONSTRAINT fk_producto_formato_producto
FOREIGN KEY (id_formato_producto) 
REFERENCES formato_producto(id_formato_producto); 

-- FK producto_categoria
ALTER TABLE producto
ADD CONSTRAINT fk_producto_categoria
FOREIGN KEY (id_categoria) 
REFERENCES categoria(id_categoria);

