package org.proyecto_integrador.woofandbarf.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Long id;

    // Usuario que hace el pedido
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private User user;

    // Dirección seleccionada para el envío
    @ManyToOne
    @JoinColumn(name = "id_direccion", nullable = false)
    private Address address;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(nullable = false)
    private Double total;

    @Column(length = 50)
    private String numeroRastreador; // ahora puede ser null

    @Column(nullable = false, length = 20)
    private String estado = "PENDIENTE";

    // Relación con los detalles del pedido
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoDetalle> detalles;

    public Pedido() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public String getNumeroRastreador() { return numeroRastreador; }
    public void setNumeroRastreador(String numeroRastreador) { this.numeroRastreador = numeroRastreador; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public List<PedidoDetalle> getDetalles() { return detalles; }
    public void setDetalles(List<PedidoDetalle> detalles) { this.detalles = detalles; }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Pedido p)) return false;
        return Objects.equals(id, p.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
