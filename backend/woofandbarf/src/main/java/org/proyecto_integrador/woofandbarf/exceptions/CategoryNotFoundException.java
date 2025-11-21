package org.proyecto_integrador.woofandbarf.exceptions;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(Long id) {
        super("No se encontró la Category con id: " + id);
    }
}

