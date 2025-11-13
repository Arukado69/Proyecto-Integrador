-- Creacion llave foranea de direccion a usuarios
ALTER TABLE direccion
ADD CONSTRAINT fk_direccion_usuario
FOREIGN KEY (id_usuario)
REFERENCES usuario(id_usuario);