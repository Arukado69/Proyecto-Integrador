package org.proyecto_integrador.woofandbarf.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "pedido")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido", nullable = false)
    private Integer idPedido;
    @Column(name = "id_carrito", nullable = false)
    private Integer idCarrito;
    @Column(length = 255, nullable = false)
    private String direccion;
    @Column(name = "total_venta", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalVenta;

    //Relacion 1:1 //
    @OneToOne
    @JoinColumn(name = "carrito_id_pedido")
    @JsonIgnore
    private Carrito carrito;

    //Constructor


    public Pedido(Integer idPedido, Integer idCarrito, String direccion, BigDecimal totalVenta, Carrito carrito) {
        this.idPedido = idPedido;
        this.idCarrito = idCarrito;
        this.direccion = direccion;
        this.totalVenta = totalVenta;
        this.carrito = carrito;
    }

    //Consrtructor vacio
    public Pedido(){

    }
    //getter y setter


    public Integer getIdCarrito() {
        return idCarrito;
    }

    public void setIdCarrito(Integer idCarrito) {
        this.idCarrito = idCarrito;
    }

    public Carrito getCarrito() {
        return carrito;
    }

    public void setCarrito(Carrito carrito) {
        this.carrito = carrito;
    }

    public Integer getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Integer idPedido) {
        this.idPedido = idPedido;
    }


    public BigDecimal getTotalVenta() {
        return totalVenta;
    }

    public void setTotalVenta(BigDecimal totalVenta) {
        this.totalVenta = totalVenta;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    //toString()

    @Override
    public String toString() {
        return "Pedido{" +
                "idPedido=" + idPedido +
                ", Carrito=" + idCarrito +
                ", direccion='" + direccion + '\'' +
                ", totalVenta=" + totalVenta +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Pedido pedido)) return false;
        return Objects.equals(idPedido, pedido.idPedido) && Objects.equals(idCarrito, pedido.idCarrito) && Objects.equals(direccion, pedido.direccion) && Objects.equals(totalVenta, pedido.totalVenta);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idPedido, idCarrito, direccion, totalVenta);
    }
}
