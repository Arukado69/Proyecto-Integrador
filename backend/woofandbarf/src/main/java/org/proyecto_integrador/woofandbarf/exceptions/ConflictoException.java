package org.proyecto_integrador.woofandbarf.exceptions;

public class ConflictoException extends RuntimeException {
    public ConflictoException(String message) {
        super(message);
    }
}

// se usa cuando el usuario intenta hacer algo y entra en conflicto con un dato que ya existe, por ejemplo
// un email ya registrado o algo parecido y representa el 409
