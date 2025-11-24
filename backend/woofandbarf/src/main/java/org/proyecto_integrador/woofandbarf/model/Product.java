package org.proyecto_integrador.woofandbarf.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "productos")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_product")
    private Long id;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, length = 255)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer stock;

    // RELACIÓN: muchos productos pertenecen a 1 categoría
    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private Category category;

    // RELACIÓN: un producto tiene muchas reviews
    @OneToMany(mappedBy = "product")
    private List<Review> reviews;

    // RELACIÓN: un producto tiene muchos detalles de carrito
    @OneToMany(mappedBy = "product")
    private List<CartDetail> cartDetails;

    // RELACIÓN: un producto tiene muchos detalles de pedido
    @OneToMany(mappedBy = "product")
    private List<PedidoDetalle> pedidoDetalles;

    // --- Getters y Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public List<Review> getReviews() { return reviews; }
    public void setReviews(List<Review> reviews) { this.reviews = reviews; }

    public List<CartDetail> getCartDetails() { return cartDetails; }
    public void setCartDetails(List<CartDetail> cartDetails) { this.cartDetails = cartDetails; }

    public List<PedidoDetalle> getPedidoDetalles() { return pedidoDetalles; }
    public void setPedidoDetalles(List<PedidoDetalle> pedidoDetalles) { this.pedidoDetalles = pedidoDetalles; }


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

