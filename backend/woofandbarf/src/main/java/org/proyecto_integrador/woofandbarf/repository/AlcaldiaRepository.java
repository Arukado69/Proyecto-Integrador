package org.proyecto_integrador.woofandbarf.repository;

import org.proyecto_integrador.woofandbarf.model.Alcaldia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlcaldiaRepository extends JpaRepository<Alcaldia, Long> {

    Alcaldia findByNombre(String nombre);
}
