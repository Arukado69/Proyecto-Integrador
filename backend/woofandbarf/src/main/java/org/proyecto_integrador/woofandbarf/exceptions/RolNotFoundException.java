package org.proyecto_integrador.woofandbarf.exceptions;

public class RolNotFoundException extends RuntimeException {
    public RolNotFoundException(Integer id) {
        super("No se encontó el id solicitado: " + id);
    }
}
