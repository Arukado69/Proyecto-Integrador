package org.proyecto_integrador.woofandbarf.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table (name = "pedido")
public class Pedido {
    // PK
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Integer idPedido;

    //Los otros atributos
    // es FK que viene de la tabla usuario
    // @Column(name = "id_usuario", nullable = false)
    // private Integer idUsuario;

    @Column(name = "direccion_envio", nullable = false, unique = true, length = 100)
    private String direccionEnvio;

    @Column(name = "total_venta", nullable = false, columnDefinition = "DECIMAL(10,2)")
    private Double totalVenta;

    @Column(name = "numero_rastreador", nullable = false)
    private String numeroRastreador;

    @Column(name = "fecha_creacion", nullable = false, columnDefinition = "DATETIME")
    @org.hibernate.annotations.CreationTimestamp
    private LocalDateTime fechaCreacion;

    // Relacion de FK 1:N (Un usuario puede tener varios pedidos) LO COMENTE PORQUE ME DABA ERROR Y NO SUPE JEJE
    /*@OneToMany(cascade = CascadeType.ALL, mappedBy = "pedido")
    private User user;
    */
    @ManyToOne
    @JoinColumn(name = "id_user",nullable = false)
    private User user;

    public Pedido(Integer idPedido, User user, String direccionEnvio, Double totalVenta, String numeroRastreador, LocalDateTime fechaCreacion) {
        this.idPedido = idPedido;
        this.user = user;
        this.direccionEnvio = direccionEnvio;
        this.totalVenta = totalVenta;
        this.numeroRastreador = numeroRastreador;
        this.fechaCreacion = fechaCreacion;
    }

    // Constructor vacio
    public Pedido(){
    }

    // getters and setter
    public Integer getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Integer idPedido) {
        this.idPedido = idPedido;
    }

    public User getUser() { return user; }

    public void setUser(User user) {
        this.user = user;
    }

    public String getDireccionEnvio() {
        return direccionEnvio;
    }

    public void setDireccionEnvio(String direccionEnvio) {
        this.direccionEnvio = direccionEnvio;
    }

    public Double getTotalVenta() {
        return totalVenta;
    }

    public void setTotalVenta(Double totalVenta) {
        this.totalVenta = totalVenta;
    }

    public String getNumeroRastreador() {
        return numeroRastreador;
    }

    public void setNumeroRastreador(String numeroRastreador) {
        this.numeroRastreador = numeroRastreador;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }


    // toString()
    @Override
    public String toString() {
        return "Pedido{" +
                "idPedido=" + idPedido +
                ", direccionEnvio='" + direccionEnvio + '\'' +
                ", totalVenta=" + totalVenta +
                ", numeroRastreador='" + numeroRastreador + '\'' +
                ", fechaCreacion=" + fechaCreacion +
                '}';
    }

    // HashCode and equals
    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Pedido pedido)) return false;
        return Objects.equals(idPedido, pedido.idPedido);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idPedido);
    }
}
