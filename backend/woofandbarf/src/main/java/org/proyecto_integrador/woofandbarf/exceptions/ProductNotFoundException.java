package org.proyecto_integrador.woofandbarf.exceptions;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(Integer id) {
        super("No se encontró el Product con id: " + id);
    }
}

