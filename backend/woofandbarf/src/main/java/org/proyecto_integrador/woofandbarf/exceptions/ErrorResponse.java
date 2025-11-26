package org.proyecto_integrador.woofandbarf.exceptions;

public class ErrorResponse extends RuntimeException {
    public ErrorResponse(String message) {
        super(message);
    }
}
