package org.proyecto_integrador.woofandbarf.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * Detalle (línea) de un carrito: producto + cantidad.
 */
@Entity
@Table(name = "carrito_detalle")
public class CarritoDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_carrito_detalle")
    private Integer idCarritoDetalle;

    @ManyToOne
    @JsonBackReference
    private Carrito carrito;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    private Integer cantidad;

    @Column(name = "precio_unitario", precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(precision = 10, scale = 2)
    private BigDecimal subtotal;
        //

    public CarritoDetalle(Integer idCarritoDetalle, Carrito carrito, Producto producto, Integer cantidad, BigDecimal precioUnitario, BigDecimal subtotal) {
        this.idCarritoDetalle = idCarritoDetalle;
        this.carrito = carrito;
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
    }


     public CarritoDetalle () {}

    // ====== Getters y Setters ======

    public Integer getIdCarritoDetalle() {
        return idCarritoDetalle;
    }

    public void setIdCarritoDetalle(Integer idCarritoDetalle) {
        this.idCarritoDetalle = idCarritoDetalle;
    }

    public Carrito getCarrito() {
        return carrito;
    }

    public void setCarrito(Carrito carrito) {
        this.carrito = carrito;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    //toString()

    @Override
    public String toString() {
        return "CarritoDetalle{" +
                "idCarritoDetalle=" + idCarritoDetalle +
                // ", carrito=" + carrito +  <-- BORRA O COMENTA ESTA LÍNEA
                ", producto=" + producto +
                ", cantidad=" + cantidad +
                ", precioUnitario=" + precioUnitario +
                ", subtotal=" + subtotal +
                '}';
    }
    //equals y hasshcode

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof CarritoDetalle that)) return false;
        return Objects.equals(idCarritoDetalle, that.idCarritoDetalle) && Objects.equals(carrito, that.carrito) && Objects.equals(producto, that.producto) && Objects.equals(cantidad, that.cantidad) && Objects.equals(precioUnitario, that.precioUnitario) && Objects.equals(subtotal, that.subtotal);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idCarritoDetalle, carrito, producto, cantidad, precioUnitario, subtotal);
    }
}
