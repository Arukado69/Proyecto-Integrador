package org.proyecto_integrador.woofandbarf.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "carrito_detalle")
public class CartDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_carrito_detalle")
    private Long idCarritoDetalle;

    @ManyToOne
    @JoinColumn(name = "id_carrito", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_product", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Double subtotal;

    @Column(name = "creacion_carrito", nullable = false)
    private LocalDateTime creacionCarrito;

    @PrePersist
    protected void onCreate() {
        this.creacionCarrito = LocalDateTime.now();
        this.subtotal = this.price * this.quantity;
    }

    public CartDetail() {}

    // Getters & Setters
    public Long getIdCarritoDetalle() { return idCarritoDetalle; }
    public void setIdCarritoDetalle(Long idCarritoDetalle) { this.idCarritoDetalle = idCarritoDetalle; }

    public Cart getCart() { return cart; }
    public void setCart(Cart cart) { this.cart = cart; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        this.subtotal = this.price * quantity;
    }

    public Double getPrice() { return price; }
    public void setPrice(Double price) {
        this.price = price;
        this.subtotal = price * this.quantity;
    }

    public Double getSubtotal() { return subtotal; }

    public LocalDateTime getCreacionCarrito() { return creacionCarrito; }
    public void setCreacionCarrito(LocalDateTime creacionCarrito) { this.creacionCarrito = creacionCarrito; }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof CartDetail d)) return false;
        return Objects.equals(idCarritoDetalle, d.idCarritoDetalle);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idCarritoDetalle);
    }
}
