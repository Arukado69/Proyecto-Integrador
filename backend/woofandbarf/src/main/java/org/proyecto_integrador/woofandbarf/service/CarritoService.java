package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.ErrorInternoException;
import org.proyecto_integrador.woofandbarf.exceptions.RecursoNoEncontradoException;
import org.proyecto_integrador.woofandbarf.interfaces.ICarritoService;
import org.proyecto_integrador.woofandbarf.model.Carrito;
import org.proyecto_integrador.woofandbarf.model.CarritoDetalle;
import org.proyecto_integrador.woofandbarf.model.Producto;
import org.proyecto_integrador.woofandbarf.model.Usuario;
import org.proyecto_integrador.woofandbarf.repository.CarritoDetalleRepository;
import org.proyecto_integrador.woofandbarf.repository.CarritoRepository;
import org.proyecto_integrador.woofandbarf.repository.ProductoRepository;
import org.proyecto_integrador.woofandbarf.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Implementación de las reglas de negocio para carritos.
 */
@Service
public class CarritoService implements ICarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private CarritoDetalleRepository carritoDetalleRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public Carrito obtenerCarritoPorUsuario(Integer idUsuario) {
        return carritoRepository.findByUsuario_IdUsuario(idUsuario)
                .orElseGet(() -> {
                    Usuario usuario = usuarioRepository.findById(idUsuario)
                            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

                    Carrito carrito = new Carrito();
                    carrito.setUsuario(usuario);
                    carrito.setFechaCreacion(LocalDateTime.now());
                    carrito.setFechaActualizacion(LocalDateTime.now());
                    return carritoRepository.save(carrito);
                });
    }

    @Override
    public CarritoDetalle agregarProducto(Integer idUsuario, Integer idProducto, Integer cantidad) {
        Carrito carrito = obtenerCarritoPorUsuario(idUsuario);
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado"));

        // Buscar si ya existe un detalle con ese producto en el carrito
        CarritoDetalle detalleExistente = carrito.getDetalles().stream()
                .filter(d -> d.getProducto().getIdProducto().equals(idProducto))
                .findFirst()
                .orElse(null);

        if (detalleExistente == null) {
            CarritoDetalle nuevo = new CarritoDetalle();
            nuevo.setCarrito(carrito);
            nuevo.setProducto(producto);
            nuevo.setCantidad(cantidad);
            nuevo.setPrecioUnitario(producto.getPrecio());
            nuevo.setSubtotal(producto.getPrecio().multiply(BigDecimal.valueOf(cantidad)));

            carrito.getDetalles().add(nuevo);
            recalcularTotal(carrito);
            carrito.setFechaActualizacion(LocalDateTime.now());

            carritoRepository.save(carrito); // cascade guarda el detalle
            return nuevo;
        } else {
            int nuevaCantidad = detalleExistente.getCantidad() + cantidad;
            detalleExistente.setCantidad(nuevaCantidad);
            detalleExistente.setSubtotal(detalleExistente.getPrecioUnitario()
                    .multiply(BigDecimal.valueOf(nuevaCantidad)));

            recalcularTotal(carrito);
            carrito.setFechaActualizacion(LocalDateTime.now());

            carritoRepository.save(carrito);
            return detalleExistente;
        }
    }

    @Override
    public void eliminarDetalle(Integer idCarritoDetalle) {
        CarritoDetalle detalle = carritoDetalleRepository.findById(idCarritoDetalle)
                .orElseThrow(() -> new RecursoNoEncontradoException("Detalle de carrito no encontrado"));

        Carrito carrito = detalle.getCarrito();
        carrito.getDetalles().remove(detalle);
        carritoDetalleRepository.delete(detalle);

        recalcularTotal(carrito);
        carrito.setFechaActualizacion(LocalDateTime.now());
        carritoRepository.save(carrito);
    }

    @Override
    public void vaciarCarrito(Integer idUsuario) {
        try {
            Carrito carrito = obtenerCarritoPorUsuario(idUsuario);
            carrito.getDetalles().clear();
            carrito.setTotal(BigDecimal.ZERO);
            carrito.setFechaActualizacion(LocalDateTime.now());
            carritoRepository.save(carrito);
        } catch (RuntimeException e) {
            throw new ErrorInternoException("Error al vaciar el carrito");
        }
    }

    // ==== Helpers ====

    private void recalcularTotal(Carrito carrito) {
        BigDecimal total = carrito.getDetalles().stream()
                .map(CarritoDetalle::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        carrito.setTotal(total);
    }
}

