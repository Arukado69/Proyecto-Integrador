package org.proyecto_integrador.woofandbarf.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "carrito") // Mapea a tabla SQL 'carrito'
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_carrito")
    private Integer idCarrito;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private User user;

    // Relación bidireccional con los detalles
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartDetail> details = new ArrayList<>();

    // Constructores, Getters y Setters
    public Cart() {}

    public Integer getIdCarrito() { return idCarrito; }
    public void setIdCarrito(Integer idCarrito) { this.idCarrito = idCarrito; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<CartDetail> getDetails() { return details; }
    public void setDetails(List<CartDetail> details) { this.details = details; }

}
