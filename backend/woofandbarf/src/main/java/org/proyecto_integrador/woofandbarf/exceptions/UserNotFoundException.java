package org.proyecto_integrador.woofandbarf.exceptions;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Integer id){
        super("No se encontró el id solicitado: " + id);
    }
}
