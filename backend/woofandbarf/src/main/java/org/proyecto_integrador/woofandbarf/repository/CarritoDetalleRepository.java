package org.proyecto_integrador.woofandbarf.repository;

import org.proyecto_integrador.woofandbarf.model.CarritoDetalle;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Acceso a datos de detalles de carrito.
 */
public interface CarritoDetalleRepository extends JpaRepository<CarritoDetalle, Integer> {
}
