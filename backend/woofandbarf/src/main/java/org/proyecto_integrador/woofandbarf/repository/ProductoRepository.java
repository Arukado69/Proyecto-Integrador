package org.proyecto_integrador.woofandbarf.repository;

import org.proyecto_integrador.woofandbarf.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Acceso a datos de productos.
 */
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
}
