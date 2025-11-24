package org.proyecto_integrador.woofandbarf.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "alcaldias")
public class Alcaldia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alcaldia")
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String nombre;

    // Relación 1:N con direcciones
    @OneToMany(mappedBy = "alcaldia")
    private List<Address> addresses;

    public Alcaldia() {}

    public Alcaldia(String nombre){
        this.nombre = nombre;
    }

    // Getters y Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public List<Address> getAddresses() { return addresses; }
    public void setAddresses(List<Address> addresses) { this.addresses = addresses; }

    // equals y hashcode solo por ID
    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Alcaldia alcaldia)) return false;
        return Objects.equals(id, alcaldia.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

