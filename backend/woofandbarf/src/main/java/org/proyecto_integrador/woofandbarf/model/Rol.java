package org.proyecto_integrador.woofandbarf.model;

import jakarta.persistence.*;


import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "roles")
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    //VARIABLES DE INSTANCIA
    private Integer idRol;


    @Column(name = "rol_pagina", nullable = false, unique = true, length = 30)
    private String rolPagina;

    //relacion 1: N
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "rol")
    private List<User> user;


    //constructores


    public Rol(int idRol, String rolPagina) {
        this.idRol = idRol;
        this.rolPagina = rolPagina;
    }

    public Rol(){

    }

    //Getters y Setters

    public void setIdRol(Integer idRol) {
        this.idRol = idRol;
    }

    public int getIdRol() {
        return idRol;
    }

    public void setIdRol(int idRol) {
        this.idRol = idRol;
    }

    public String getRolPagina() {
        return rolPagina;
    }

    public void setRolPagina(String rolPagina) {
        this.rolPagina = rolPagina;
    }

    public List<User> getUser() {
        return user;
    }

    public void setUser(List<User> user) {
        this.user = user;
    }

//ToString()

    @Override
    public String toString() {
        return "Roles{" +
                "idRol=" + idRol +
                ", rolPagina='" + rolPagina + '\'' +
                '}';
    }

    //Equals() y HashCode()

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Rol rol)) return false;
        return idRol == rol.idRol && Objects.equals(rolPagina, rol.rolPagina);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idRol, rolPagina);
    }
}
