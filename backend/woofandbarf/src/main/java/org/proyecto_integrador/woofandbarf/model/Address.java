package org.proyecto_integrador.woofandbarf.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "direccion")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_direccion")
    private Long id;

    @Column(nullable = false, length = 120)
    private String street;

    @Column(nullable = false, length = 20)
    private String number;

    @Column(length = 20)
    private String interior;

    @Column(nullable = false, length = 120)
    private String colonia;

    @Column(nullable = false, length = 10)
    private String postalCode;

    // RELACIÓN CON USER (1:N)
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnore
    private User user;

    // RELACIÓN CON ALCALDÍA
    @ManyToOne
    @JoinColumn(name = "id_alcaldia", nullable = false)
    private Alcaldia alcaldia;

    // Getters y Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getStreet() { return street; }

    public void setStreet(String street) { this.street = street; }

    public String getNumber() { return number; }

    public void setNumber(String number) { this.number = number; }

    public String getPostalCode() { return postalCode; }

    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public Alcaldia getAlcaldia() { return alcaldia; }

    public void setAlcaldia(Alcaldia alcaldia) { this.alcaldia = alcaldia; }

    //Getter y Setter de User


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getInterior() {
        return interior;
    }

    public void setInterior(String interior) {
        this.interior = interior;
    }

    public String getColonia() {
        return colonia;
    }

    public void setColonia(String colonia) {
        this.colonia = colonia;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Address address)) return false;
        return Objects.equals(id, address.id);
    }

    @Override
    public int hashCode() { return Objects.hash(id); }
}

