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
    private Integer idCarritoDetalle; // Cambiado a Integer

    // Relación con Carrito
    @ManyToOne
    @JoinColumn(name = "id_carrito", nullable = false)
    private Cart cart;

    // Relación con Producto
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "creacion_carrito", nullable = false)
    private LocalDateTime creacionCarrito;

    @PrePersist
    protected void onCreate() {
        this.creacionCarrito = LocalDateTime.now();
    }

    // Constructores
    public CartDetail() {}

    // Getters y Setters
    public Integer getIdCarritoDetalle() {
        return idCarritoDetalle;
    }

    public void setIdCarritoDetalle(Integer idCarritoDetalle) {
        this.idCarritoDetalle = idCarritoDetalle;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public LocalDateTime getCreacionCarrito() {
        return creacionCarrito;
    }

    public void setCreacionCarrito(LocalDateTime creacionCarrito) {
        this.creacionCarrito = creacionCarrito;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof CartDetail that)) return false;
        return Objects.equals(idCarritoDetalle, that.idCarritoDetalle) && Objects.equals(cart, that.cart) && Objects.equals(product, that.product) && Objects.equals(cantidad, that.cantidad) && Objects.equals(creacionCarrito, that.creacionCarrito);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idCarritoDetalle, cart, product, cantidad, creacionCarrito);
    }

    @Override
    public String toString() {
        return "CartDetail{" +
                "idCarritoDetalle=" + idCarritoDetalle +
                ", cart=" + cart +
                ", product=" + product +
                ", cantidad=" + cantidad +
                ", creacionCarrito=" + creacionCarrito +
                '}';
    }
}
