-- Script para agregar 

-- Insertar roles
INSERT INTO roles (rol_pagina) VALUES
('administrador'),
('cliente');

-- Insertar usuario
INSERT INTO usuario (
    nombre, apellidos, email, telefono, fecha_nacimiento, contrasena, codigo_verificacion, codigo_expiracion, esta_verificado, id_rol) VALUES
('Karen', 'Nava', 'noemail@aol.com', '5616104115', '1995-11-25',
 'woofbarf123', 'ABC123', NOW(), FALSE, 1),

('Deyanira', 'Ruiz', 'noeamail@aol.com', '4422391206', '2000-06-30',
 'woofbarf456', 'BCD234', NOW(), FALSE, 1),

('Veaney', 'Vargas', 'noeamail@aol.com', '5512576735', '1996-02-07',
 'woofbarf789', 'CDE345', NOW(), FALSE, 1),

('Joana', 'Barbosa', 'noeamail@aol.com', '2228112547', '1997-05-06',
 'woof123barf', 'DEF456', NOW(), FALSE, 1),

('Brad', 'Robles', 'noeamail@aol.com', '5511883942', '1998-10-11',
 'woof456barf', 'EFG567', NOW(), FALSE, 1),

('Ricardo', 'Luna', 'noeamail@aol.com', '5522069771', '1996-05-18',
 'woof789barf', 'FGH678', NOW(), FALSE, 1),

('Ricardo', 'Aviles', 'noeamail@aol.com', '5512426882', '1997-04-03',
 '123woofbarf', 'GHI789', NOW(), FALSE, 1),

('Omar', 'Albis', 'noeamail@aol.com', '5585439212', '1996-12-27',
 '456woofbarf', 'HIJ890', NOW(), FALSE, 1);
 
 -- insertar formato_producto 
 INSERT INTO formato_producto (formato) VALUES
('Pieza Unica'),
('Paquete');

-- insertar categoria
INSERT INTO categoria (categoria) VALUES
('Proteina'),
('Articulo'),
('Juguete');

-- insertar producto
INSERT INTO producto (id_producto, nombre_producto, descripcion, imagen, id_formato_producto, cantidad_stock, tamano, precio, id_categoria, descuento) VALUES
('PR1', 'Pollo', 'Pollo 500 gramos a $399', 'pollo-500.jpg', 1, 10, '500 gr', 399, 1, 0.00),

('PR2', 'Pollo', 'Pollo 1000 gramos a $899', 'pollo-1000.jpg', 1, 15, '1 kg', 899, 1, 0.00),

('PR3', 'Pollo', 'Pollo 2000 gramos a $1299', 'pollo-2000.jpg', 1, 20, '2 kg', 1299, 1, 0.00),

('PR4', 'Res', 'Res 1000 gramos a $899', 'res-1000.jpg', 1, 5, '1 kg', 899, 1, 0.00),

('PR5', 'Pelota', 'Pelota Woof & BARF $100', 'pelota.jpg', 1, 30, 'unitalla', 100, 3, 0.00);

-- insertar alcaldia
INSERT INTO alcaldia (alcaldia_nombre, ubicacion) VALUES
('Álvaro Obregón', 'Oeste'),
('Benito Juárez', 'Centro'),
('Coyoacán', 'Sur'),
('Iztapalapa', 'Este'),
('Miguel Hidalgo', 'Oeste');

-- insertar direccion
INSERT INTO direccion (id_usuario, id_alcaldia, direccion, tipo_direccion) VALUES
(1, 2, 'Av. Insurgentes Sur 1234, Col. Del Valle', 'domicilio'),
(2, 3, 'Calz. de Tlalpan 234, Col. Churubusco', 'departamento'),
(3, 4, 'Eje 6 Sur 55, Col. Iztapalapa', 'oficina'),
(1, 5, 'Campos Elíseos 100, Polanco', 'domicilio');

-- insertar tarjeta
INSERT INTO tarjeta (id_usuario, numero_tarjeta, tipo_card, fecha_expiracion, cvv) VALUES
(1, '4111111111111111', 'credito', '12/28', '123'),
(2, '5500000000000004', 'debito', '11/27', '456');

-- insertar carrito
INSERT INTO carrito (id_usuario) VALUES
(1), (2), (3), (4), (5);

-- insertar carrito_detalle
INSERT INTO carrito_detalle (id_carrito, id_producto, cantidad, creacion_carrito) VALUES
(1, 'PR1', 2, NOW()),
(1, 'PR2', 1, NOW()),
(2, 'PR3', 3, NOW()),
(3, 'PR5', 1, NOW()),
(4, 'PR4', 2, NOW());

-- insertar review
INSERT INTO review (id_producto, id_usuario, rating, comentario, fecha_review) VALUES
('PR1', 1, 5, 'Desde que le doy sus sobres de Woof BARF Milo ha estado más activo, lo noto más feliz.', '2025-11-13'),
('PR2', 2, 5, 'Probé la marca para ver que tal y desde que Kiki come sus sobrecitos le he notado su pelito más suave y brilloso.', '2025-11-10'),
('PR3', 3, 5, 'Me recomendaron esta marca y honestamente me sorprendió que sus ingredientes son de la más alta calidad.', '2025-10-28');

-- insertar pedido
INSERT INTO pedido (id_usuario, direccion_envio, total_venta, numero_rastreador)
VALUES
(1, 'Av. Insurgentes Sur 1234, Col. Del Valle', 798, 'RST001'),
(2, 'Calz. de Tlalpan 234, Col. Churubusco', 1299, 'RST002'),
(3, 'Av. Insurgentes Sur 890, Col. Del Valle', 845, 'RST003'),
(4, 'Eje Central Lázaro Cárdenas 1020, Col. Centro', 1599, 'RST004'),
(5, 'Av. Universidad 450, Col. Copilco', 620, 'RST005');

-- insertar pedido_detalle
INSERT INTO pedido_detalle (id_pedido, id_producto, cantidad, precio) VALUES
(1, 'PR1', 2, 399),
(2, 'PR3', 1, 1299),
(3, 'PR2', 1, 899),
(4, 'PR4', 1, 899),
(5, 'PR5', 1, 100);

