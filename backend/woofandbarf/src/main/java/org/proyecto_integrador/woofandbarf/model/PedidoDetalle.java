package org.proyecto_integrador.woofandbarf.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table (name = "pedido_detalle")

public class PedidoDetalle {
    // PK
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido_detalle")
    private Integer idPedidoDetalle;

    // FK tiene relacion con el id_pedido
    @Column(name = "id_pedido", nullable = false)
    private Integer idPedido;

    // Fk tiene relacion con el id_producto
    @Column(name = "id_producto", nullable = false, length = 50)
    private String idProducto;

    @Column(name = "cantidad", nullable = false)
    private Integer Cantidad;

    @Column(name = "precio", nullable = false, columnDefinition = "DECIMAL(10,2)")
    private Double Precio;

    public PedidoDetalle(Integer idPedidoDetalle, Integer idPedido, String idProducto, Integer Cantidad, Double Precio) {
        this.idPedidoDetalle = idPedidoDetalle;
        this.idPedido = idPedido;
        this.idProducto = idProducto;
        this.Cantidad = Cantidad;
        this.Precio = Precio;
    }

    // FK Relación muchos detalles en un pedido
    @ManyToOne
    @JoinColumn(name = "pedido_id_pedido_detalle")
    private Pedido pedido;

    /*
    // Fk relacion pedido_detalle con productos, la comento porque no se si esta bien
    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto producto;
     */

    // constructor vacio
    public PedidoDetalle() {
    }

    // getters and setters
    public Integer getIdPedidoDetalle() {
        return idPedidoDetalle;
    }

    public void setIdPedidoDetalle(Integer idPeidoDetalle) {
        this.idPedidoDetalle = idPeidoDetalle;
    }

    public Integer getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Integer idPedido) {
        this.idPedido = idPedido;
    }

    public String getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(String idProducto) {
        this.idProducto = idProducto;
    }

    public Integer getCantidad() {
        return Cantidad;
    }

    public void setCantidad(Integer cantidad) {
        Cantidad = cantidad;
    }

    public Double getPrecio() {
        return Precio;
    }

    public void setPrecio(Double precio) {
        Precio = precio;
    }

    // getter and setter de pedido esto tiene relacion con las FK

    // getter and setter de producto tiene relacion con FK

    // toString()
    @Override
    public String toString() {
        return "PedidoDetalle{" +
                "idPedidoDetalle=" + idPedidoDetalle +
                ", idPedido=" + idPedido +
                ", idProducto='" + idProducto + '\'' +
                ", Cantidad=" + Cantidad +
                ", Precio=" + Precio +
                '}';
    }

    // HashCode and equals
    @Override
    public boolean equals(Object o) {
        if (!(o instanceof PedidoDetalle that)) return false;
        return Objects.equals(idPedidoDetalle, that.idPedidoDetalle) && Objects.equals(idPedido, that.idPedido) && Objects.equals(idProducto, that.idProducto) && Objects.equals(Cantidad, that.Cantidad) && Objects.equals(Precio, that.Precio);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idPedidoDetalle, idPedido, idProducto, Cantidad, Precio);
    }
}

