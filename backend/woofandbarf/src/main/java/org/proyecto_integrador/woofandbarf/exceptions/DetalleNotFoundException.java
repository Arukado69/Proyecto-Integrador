package org.proyecto_integrador.woofandbarf.exceptions;

public class DetalleNotFoundException extends RuntimeException {
    public DetalleNotFoundException(Integer id) {
        super("No se encuentra el User con id: " + id);
    }
}
