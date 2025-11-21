package org.proyecto_integrador.woofandbarf.repository;


import org.proyecto_integrador.woofandbarf.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Integer>{
    User findByEmail(String email);

    User findByTelefono(String telefono);
}
