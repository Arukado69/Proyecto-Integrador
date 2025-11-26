package org.proyecto_integrador.woofandbarf.interfaces;

import org.proyecto_integrador.woofandbarf.model.Carrito;
import org.proyecto_integrador.woofandbarf.model.CarritoDetalle;

public interface ICarritoService {

    Carrito obtenerCarritoPorUsuario(Integer idUsuario);

    CarritoDetalle agregarProducto(Integer idUsuario, Integer idProducto, Integer cantidad);

    void eliminarDetalle(Integer idCarritoDetalle);

    void vaciarCarrito(Integer idUsuario);
}

