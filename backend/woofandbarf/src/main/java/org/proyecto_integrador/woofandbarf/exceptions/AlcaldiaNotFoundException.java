package org.proyecto_integrador.woofandbarf.exceptions;

public class AlcaldiaNotFoundException extends RuntimeException {
    public AlcaldiaNotFoundException(Long id) {
        super("No se encontró la Alcaldia con id: " + id);
    }
}

