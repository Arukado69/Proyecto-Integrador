package org.proyecto_integrador.woofandbarf.model;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "alcaldias")
public class Alcaldia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alcaldia")
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String name;

    // Getters y Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Alcaldia alcaldia)) return false;
        return Objects.equals(id, alcaldia.id)
                && Objects.equals(name, alcaldia.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
}

