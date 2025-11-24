package org.proyecto_integrador.woofandbarf.model;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "pedido_detalle")
public class PedidoDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido_detalle")
    private Long id;

    // Relación: muchos detalles -> un pedido
    @ManyToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;

    // Relación: muchos detalles -> un producto
    @ManyToOne
    @JoinColumn(name = "id_product", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Double subtotal;

    public PedidoDetalle() {}

    public PedidoDetalle(Pedido pedido, Product product, Integer quantity, Double price) {
        this.pedido = pedido;
        this.product = product;
        this.quantity = quantity;
        this.price = price;
        this.subtotal = price * quantity;
    }

    // Getters & Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }

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
        this.subtotal = this.quantity * price;
    }

    public Double getSubtotal() { return subtotal; }

    // Equals & Hash
    @Override
    public boolean equals(Object o) {
        if (!(o instanceof PedidoDetalle d)) return false;
        return Objects.equals(id, d.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
