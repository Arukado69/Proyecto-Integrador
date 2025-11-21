package org.proyecto_integrador.woofandbarf.exceptions;

public class AddressNotFoundException extends RuntimeException {
    public AddressNotFoundException(Long id) {
        super("No se encontró la Address con id: " + id);
    }
}
