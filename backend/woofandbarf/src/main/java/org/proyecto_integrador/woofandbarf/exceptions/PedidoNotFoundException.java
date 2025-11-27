package org.proyecto_integrador.woofandbarf.exceptions;

public class PedidoNotFoundException extends RuntimeException {
    public PedidoNotFoundException(Integer id) {
        super("No se encuentra el User con id: " + id);
    }
}
