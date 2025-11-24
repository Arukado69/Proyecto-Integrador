package org.proyecto_integrador.woofandbarf.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Objects;

@Entity
@Table(name = "carrito")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_carrito")
    private Long idCarrito;

    // Relación 1:1 con User
    @OneToOne
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    // Relación 1:N con CartDetail
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartDetail> details = new ArrayList<>();

    public Cart() {}

    // Getters y Setters
    public Long getIdCarrito() { return idCarrito; }
    public void setIdCarrito(Long idCarrito) { this.idCarrito = idCarrito; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<CartDetail> getDetails() { return details; }
    public void setDetails(List<CartDetail> details) { this.details = details; }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Cart c)) return false;
        return Objects.equals(idCarrito, c.idCarrito);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idCarrito);
    }
}
