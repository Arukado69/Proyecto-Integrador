package org.proyecto_integrador.woofandbarf.exceptions;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Integer id) {
        super("No se encuentra el User con id: " + id);
    }
}
