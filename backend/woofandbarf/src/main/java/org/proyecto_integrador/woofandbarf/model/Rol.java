package org.proyecto_integrador.woofandbarf.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "roles")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Long idRol;

    @Column(name = "rol_pagina", nullable = false, unique = true, length = 30)
    private String rolPagina;

    @OneToMany(mappedBy = "rol")
    @JsonIgnore // No es tan necesario , pero lo dejamos por si las dudas.
    private List<User> users;

    // Constructores
    public Rol() {}

    public Rol(String rolPagina) {
        this.rolPagina = rolPagina;
    }

    // Getters y Setters
    public Long getIdRol() { return idRol; }
    public void setIdRol(Long idRol) { this.idRol = idRol; }

    public String getRolPagina() { return rolPagina; }
    public void setRolPagina(String rolPagina) { this.rolPagina = rolPagina; }

    public List<User> getUsers() { return users; }
    public void setUsers(List<User> users) { this.users = users; }

    // equals & hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Rol rol)) return false;
        return Objects.equals(idRol, rol.idRol);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idRol);
    }
}
