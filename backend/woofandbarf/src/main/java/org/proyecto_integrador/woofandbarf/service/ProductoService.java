package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.ErrorInternoException;
import org.proyecto_integrador.woofandbarf.exceptions.PeticionInvalidaException;
import org.proyecto_integrador.woofandbarf.exceptions.RecursoNoEncontradoException;
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
        if (producto.getPrecio().doubleValue() < 0) {
            throw new PeticionInvalidaException("El precio no puede ser negativo");
        }

        if (producto.getNombre() == null || producto.getNombre().isBlank()) {
            throw new PeticionInvalidaException("El nombre del producto es obligatorio");
        }

        try {
            return productoRepository.save(producto);
        } catch (Exception ex) {
            throw new ErrorInternoException("Error al crear el producto");
        }
    }

    @Override
    public Producto obtenerPorId(Integer idProducto) {
        return productoRepository.findById(idProducto)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado"));
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

