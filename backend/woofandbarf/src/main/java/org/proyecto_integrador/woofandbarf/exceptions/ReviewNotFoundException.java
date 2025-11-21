package org.proyecto_integrador.woofandbarf.exceptions;

public class ReviewNotFoundException extends RuntimeException {
    public ReviewNotFoundException(Long id) {
        super("No se encontró la Review con id: " + id);
    }
}

