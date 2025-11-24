package org.proyecto_integrador.woofandbarf.repository;

import org.proyecto_integrador.woofandbarf.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUser_IdUsuario(Long idUsuario);

}


