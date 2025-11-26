package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.interfaces.ICarritoService;
import org.proyecto_integrador.woofandbarf.model.Carrito;
import org.proyecto_integrador.woofandbarf.model.CarritoDetalle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoints para operaciones de carrito.
 *
 * Rutas pensadas para el frontend:
 *
 * - GET    /carrito/usuario/{idUsuario}      -> obtener carrito del usuario
 * - POST   /carrito/agregar                  -> agregar producto
 * - DELETE /carrito/detalle/{idDetalle}      -> eliminar línea del carrito
 * - DELETE /carrito/vaciar/{idUsuario}       -> vaciar carrito del usuario
 */
@RestController
@RequestMapping("/api/v1/carrito")
@CrossOrigin(origins = "*")
public class CarritoController {

    @Autowired
    private ICarritoService carritoService;

    @GetMapping("/usuario/{idUsuario}")
    public Carrito obtenerCarrito(@PathVariable Integer idUsuario) {
        return carritoService.obtenerCarritoPorUsuario(idUsuario);
    }

    /**
     * El frontend debe enviar:
     * {
     *   "idUsuario": 1,
     *   "idProducto": 5,
     *   "cantidad": 2
     * }
     */
    @PostMapping("/agregar")
    public CarritoDetalle agregar(@RequestBody AgregarProductoRequest request) {
        return carritoService.agregarProducto(
                request.getIdUsuario(),
                request.getIdProducto(),
                request.getCantidad()
        );
    }

    @DeleteMapping("/detalle/{idDetalle}")
    public void eliminarDetalle(@PathVariable("idDetalle") Integer idCarritoDetalle) {
        carritoService.eliminarDetalle(idCarritoDetalle);
    }

    @DeleteMapping("/vaciar/{idUsuario}")
    public void vaciar(@PathVariable Integer idUsuario) {
        carritoService.vaciarCarrito(idUsuario);
    }

    // ===== Clase interna para request de agregar producto =====

    public static class AgregarProductoRequest {
        private Integer idUsuario;
        private Integer idProducto;
        private Integer cantidad;

        public Integer getIdUsuario() {
            return idUsuario;
        }

        public void setIdUsuario(Integer idUsuario) {
            this.idUsuario = idUsuario;
        }

        public Integer getIdProducto() {
            return idProducto;
        }

        public void setIdProducto(Integer idProducto) {
            this.idProducto = idProducto;
        }

        public Integer getCantidad() {
            return cantidad;
        }

        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }
    }
}

