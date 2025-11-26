package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.interfaces.IProductoService;
import org.proyecto_integrador.woofandbarf.model.Producto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints CRUD para productos (catálogo).
 * Rutas principales usadas por el frontend:
 *  - GET    /productos
 *  - GET    /productos/{id}
 *  - POST   /productos
 *  - PUT    /productos/{id}
 *  - DELETE /productos/{id}
 */
@RestController
@RequestMapping("/api/v1/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    @Autowired
    private IProductoService productoService;

    @GetMapping
    public List<Producto> listar() {
        return productoService.listar();
    }

    @GetMapping("/{id}")
    public Producto obtener(@PathVariable("id") Integer idProducto) {
        return productoService.obtenerPorId(idProducto);
    }

    @PostMapping
    public Producto crear(@RequestBody Producto producto) {
        return productoService.crear(producto);
    }

    @PutMapping("/{id}")
    public Producto actualizar(@PathVariable("id") Integer idProducto,
                               @RequestBody Producto producto) {
        return productoService.actualizar(idProducto, producto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable("id") Integer idProducto) {
        productoService.eliminar(idProducto);
    }
}

