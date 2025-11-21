package org.proyecto_integrador.woofandbarf.model;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "direccion")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_direccion")
    private Long id;

    // User externo: solo guardamos id
    @Column(name = "id_user", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 120)
    private String street;

    @Column(nullable = false, length = 20)
    private String number;

    @Column(nullable = false, length = 10)
    private String postalCode;

    // Alcaldía de la dirección
    @ManyToOne
    @JoinColumn(name = "id_alcaldia", nullable = false)
    private Alcaldia alcaldia;

    // Getters y Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }

    public void setUserId(Long userId) { this.userId = userId; }

    public String getStreet() { return street; }

    public void setStreet(String street) { this.street = street; }

    public String getNumber() { return number; }

    public void setNumber(String number) { this.number = number; }

    public String getPostalCode() { return postalCode; }

    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public Alcaldia getAlcaldia() { return alcaldia; }

    public void setAlcaldia(Alcaldia alcaldia) { this.alcaldia = alcaldia; }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Address address)) return false;
        return Objects.equals(id, address.id);
    }

    @Override
    public int hashCode() { return Objects.hash(id); }
}

