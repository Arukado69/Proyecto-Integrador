package org.proyecto_integrador.woofandbarf.exceptions;

public class ErrorInternoException extends RuntimeException {
    public ErrorInternoException(String message) {
        super(message);
    }
}

// se usa cuando hay un error inesperado dentro del servidor(back) que no es culpa del usuario
// por ejemplo un error al inicial la DB o cualquier excepcion imprevista y es el error 500
