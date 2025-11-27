package org.proyecto_integrador.woofandbarf.exceptions;

public class PeticionInvalidaException extends RuntimeException {
    public PeticionInvalidaException(String message) {
        super(message);
    }
}

// se usa cuando la peticion del usuario es invalida, o sea que no cumple con algo, campos obligatorios vacios, ect
// representa un 400
