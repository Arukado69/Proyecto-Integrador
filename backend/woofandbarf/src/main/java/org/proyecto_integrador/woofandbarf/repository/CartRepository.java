package org.proyecto_integrador.woofandbarf.repository;

import org.proyecto_integrador.woofandbarf.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Nota: El segundo parámetro es Integer (el tipo del ID)
@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
}
