package org.proyecto_integrador.woofandbarf.exceptions;

public class RecursoNoEncontradoException extends RuntimeException {
    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}

// se usa cunado estamos buscando algo y no lo encontramos, representa el 404