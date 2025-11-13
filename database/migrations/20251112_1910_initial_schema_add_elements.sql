-- Script para agregar 
insert into product (id_product, product_name, descripcion, image, formato_venta, cantidad_stock, tamano, precio, categoria, descuento) values
();

insert into usuario (id_usuario, nombre, apellidos, email, telefono, fecha_nacimiento, contrasena) values
();

insert into pedido (id_pedido, id_usuario, direccion, total_venta, numero_rastreador, fecha_crecion) values
();

insert into pedido_detalle(id_pedido_detalle, id_pedido, id_producto, cantidad, precio) values
();

insert into formato_producto(id_formato_producto, formato) values
();

-- Datos para address
insert into direccion (id_usuario, id_alcaldia, tipo_direccion, direccion) VALUES
(1, 2, 'domicilio', 'Av. Insurgentes Sur 1234, Col. Del Valle'),
(2, 3, 'entrega', 'Calz. de Tlalpan 234, Col. Churubusco'),
(3, 4, 'facturacion', 'Eje 6 Sur 55, Col. Iztapalapa'),
(1, 5, 'entrega', 'Campos Elíseos 100, Polanco');

-- Datos para alcaldia 
insert into alcaldia (delegacion_name, ubicacion) values
('Álvaro Obregón', 'Oeste'),
('Benito Juárez', 'Centro'),
('Coyoacán', 'Sur'),
('Iztapalapa', 'Este'),
('Miguel Hidalgo', 'Oeste');


