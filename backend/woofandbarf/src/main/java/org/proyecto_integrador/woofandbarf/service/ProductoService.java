package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.interfaces.IProductoService;
import org.proyecto_integrador.woofandbarf.model.Producto;
import org.proyecto_integrador.woofandbarf.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementación de las reglas de negocio para productos.
 */
@Service
public class ProductoService implements IProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public List<Producto> listar() {
        return productoRepository.findAll();
    }

    @Override
    public Producto crear(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    public Producto obtenerPorId(Integer idProducto) {
        return productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    @Override
    public Producto actualizar(Integer idProducto, Producto producto) {
        Producto existente = obtenerPorId(idProducto);
        // Actualizar campos básicos
        existente.setNombre(producto.getNombre());
        existente.setDescripcion(producto.getDescripcion());
        existente.setPrecio(producto.getPrecio());
        existente.setCategoria(producto.getCategoria());
        existente.setStock(producto.getStock());
        existente.setImagenUrl(producto.getImagenUrl());
        existente.setActivo(producto.getActivo());

        return productoRepository.save(existente);
    }

    @Override
    public void eliminar(Integer idProducto) {
        productoRepository.deleteById(idProducto);
    }
}

