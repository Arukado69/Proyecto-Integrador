package org.proyecto_integrador.woofandbarf.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Representa un producto del catálogo.
 */
@Entity
@Table(name = "producto")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Integer idProducto;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(length = 100)
    private String categoria;

    private Integer stock;

    @Column(name = "imagen_url", length = 255)
    private String imagenUrl;

    @Column(name = "tamano")
    private String tamano;

    @Column(name = "sabor")
    private String sabor;


    private Boolean activo = true;

    /**
     * Un producto puede aparecer en muchos detalles de carrito.
     */
    @OneToMany(mappedBy = "producto")
    @JsonIgnore
    private List<CarritoDetalle> detallesCarrito = new ArrayList<>();


    //

    public Producto(Integer idProducto, String nombre, String descripcion, BigDecimal precio, String categoria, Integer stock, String imagenUrl, String tamano, String sabor, Boolean activo, List<CarritoDetalle> detallesCarrito) {
        this.idProducto = idProducto;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
        this.imagenUrl = imagenUrl;
        this.tamano = tamano;
        this.sabor = sabor;
        this.activo = activo;
        this.detallesCarrito = detallesCarrito;
    }

    public Producto() {  }

    // ====== Getters y Setters ======

    public String getTamano() {
        return tamano;
    }

    public void setTamano(String tamano) {
        this.tamano = tamano;
    }

    public String getSabor() {return sabor; }

    public void setSabor(String sabor) {this.sabor = sabor; }

    public Integer getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public List<CarritoDetalle> getDetallesCarrito() {
        return detallesCarrito;
    }

    public void setDetallesCarrito(List<CarritoDetalle> detallesCarrito) {
        this.detallesCarrito = detallesCarrito;
    }

    //toString()

    @Override
    public String toString() {
        return "Producto{" +
                "activo=" + activo +
                ", idProducto=" + idProducto +
                ", nombre='" + nombre +
                ", descripcion='" + descripcion +
                ", precio=" + precio +
                ", categoria='" + categoria +
                ", stock=" + stock +
                ", imagenUrl='" + imagenUrl +
                ", tamano='" + tamano +
                ", sabor='" + sabor +
                ", detallesCarrito=" + detallesCarrito +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Producto producto)) return false;
        return Objects.equals(idProducto, producto.idProducto) && Objects.equals(nombre, producto.nombre) && Objects.equals(descripcion, producto.descripcion) && Objects.equals(precio, producto.precio) && Objects.equals(categoria, producto.categoria) && Objects.equals(stock, producto.stock) && Objects.equals(imagenUrl, producto.imagenUrl) && Objects.equals(tamano, producto.tamano) && Objects.equals(sabor, producto.sabor) && Objects.equals(activo, producto.activo) && Objects.equals(detallesCarrito, producto.detallesCarrito);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idProducto, nombre, descripcion, precio, categoria, stock, imagenUrl, tamano, sabor, activo, detallesCarrito);
    }
}



