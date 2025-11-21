package org.proyecto_integrador.woofandbarf.repository;

import org.proyecto_integrador.woofandbarf.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {

    Rol findByRolPagina(String rolPagina);
}
