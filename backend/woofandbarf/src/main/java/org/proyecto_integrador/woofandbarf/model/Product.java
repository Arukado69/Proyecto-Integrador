package org.proyecto_integrador.woofandbarf.model;

import jakarta.persistence.*;

import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_product")
    private Integer id;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, length = 255)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer stock;

    // Relación simple hacia Category (sin listas, sin drama)
    @ManyToOne
    @JoinColumn(name = "id_category")
    private Category category;

    //Relacion Producto -> Pedido_detalle / 1:N
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "product")
    private List<PedidoDetalle> pedidoDetalle;

    // --- Getters y Setters ---

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) { this.id = id; }

    public String getName() {
        return name;
    }

    public void setName(String name) { this.name = name; }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) { this.description = description; }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) { this.price = price; }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) { this.stock = stock; }

    public Category getCategory() { return category; }

    public void setCategory(Category category) { this.category = category; }

    //Getter y Setter de PedidoDetalle

    public List<PedidoDetalle> getPedidoDetalle() {
        return pedidoDetalle;
    }

    public void setPedidoDetalle(List<PedidoDetalle> pedidoDetalle) {
        this.pedidoDetalle = pedidoDetalle;
    }


    // --- equals y hashCode (simples, como el profe) ---

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Product product)) return false;
        return Objects.equals(id, product.id)
                && Objects.equals(name, product.name)
                && Objects.equals(description, product.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description);
    }
}

