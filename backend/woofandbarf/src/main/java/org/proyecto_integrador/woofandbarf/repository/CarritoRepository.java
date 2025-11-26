package org.proyecto_integrador.woofandbarf.repository;

import org.proyecto_integrador.woofandbarf.model.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Acceso a datos de carritos.
 */
public interface CarritoRepository extends JpaRepository<Carrito, Integer> {

    /**
     * Encuentra el carrito por el id del usuario.
     */
    Optional<Carrito> findByUsuario_IdUsuario(Integer idUsuario);
}
