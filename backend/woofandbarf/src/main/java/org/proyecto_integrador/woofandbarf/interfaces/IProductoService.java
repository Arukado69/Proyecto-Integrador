package org.proyecto_integrador.woofandbarf.interfaces;

import org.proyecto_integrador.woofandbarf.model.Producto;

import java.util.List;

/**
 * Contrato de operaciones de negocio para productos.
 */
public interface IProductoService {

    List<Producto> listar();

    Producto crear(Producto producto);

    Producto obtenerPorId(Integer idProducto);

    Producto actualizar(Integer idProducto, Producto producto);

    void eliminar(Integer idProducto);
}

