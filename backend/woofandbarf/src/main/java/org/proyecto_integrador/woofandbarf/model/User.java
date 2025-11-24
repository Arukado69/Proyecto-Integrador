package org.proyecto_integrador.woofandbarf.model;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "usuario")
public class User {

    /*
    Creando variables de instancia
    id_usuario, nombre, apellido paterno, apellido materno, email, telefono,fecha de nacimiento, password.
    */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //autoincrementable con IDENTITY
    @Column(name = "id_usuario")
    private Integer idUsuario;
    @Column(name = "nombre", nullable = false, length = 30)
    private String nombre;
    @Column(name = "apellido_paterno", nullable = false, length = 30)
    private String apellidoPaterno;
    @Column(name = "apellido_materno", nullable = false, length = 30)
    private String apellidoMaterno;
    @Column(name = "email", nullable = false,unique = true,length = 60)
    private String email;
    @Column(name = "telefono", nullable = false, unique = true, length = 15)
    private String telefono;
    @Column(name = "fecha_nacimiento", nullable = false, columnDefinition = "DATE")
    private Date fechaNacimiento;
    @Column(name = "password", nullable = false, length = 30)
    private String password;


    //Relaciones User -> Rol N:1
    @ManyToOne
    @JoinColumn(name = "rol_id_user", nullable = false)
    private Rol rol;

    //Relacion User -> Pedido / 1:N
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    private List<Pedido> pedidos;
    //Relacion User -> Direccion / 1:N
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    private List<Address> address;
    //Relacion de User -> Review / 1:N
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    private List<Review> review;

    //Constructores (Normal y vacio)


    public User(Rol rol) {
        this.rol = rol;
    }

    public User(Integer idUsuario, String nombre, String apellidoPaterno, String apellidoMaterno, String telefono, String email, Date fechaNacimiento, String password) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.telefono = telefono;
        this.email = email;
        this.fechaNacimiento = fechaNacimiento;
        this.password = password;
    }

    public User(){

    }

    //Getters y Setter de clase


    public int getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidoMaterno() {
        return apellidoMaterno;
    }

    public void setApellidoMaterno(String apellidoMaterno) {
        this.apellidoMaterno = apellidoMaterno;
    }

    public String getApellidoPaterno() {
        return apellidoPaterno;
    }

    public void setApellidoPaterno(String apellidoPaterno) {
        this.apellidoPaterno = apellidoPaterno;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Date getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    //Getter y Setter de Rol
    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }
    //Getter y Setter de Address y Pedidos

    public List<Pedido> getPedidos() {
        return pedidos;
    }

    public void setPedidos(List<Pedido> pedidos) {
        this.pedidos = pedidos;
    }

    public List<Address> getAddress() {
        return address;
    }

    public void setAddress(List<Address> address) {
        this.address = address;
    }

    //Getter y setter de Review

    public List<Review> getReview() {
        return review;
    }

    public void setReview(List<Review> review) {
        this.review = review;
    }


    //ToString()

    @Override
    public String toString() {
        return "User{" +
                "idUsuario=" + idUsuario +
                ", nombre='" + nombre + '\'' +
                ", apellidoPaterno='" + apellidoPaterno + '\'' +
                ", apellidoMaterno='" + apellidoMaterno + '\'' +
                ", email='" + email + '\'' +
                ", telefono='" + telefono + '\'' +
                ", fechaNacimiento=" + fechaNacimiento +
                '}';
    }

    //Equals() y HashCode

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof User user)) return false;
        return idUsuario == user.idUsuario && Objects.equals(nombre, user.nombre) && Objects.equals(apellidoPaterno, user.apellidoPaterno) && Objects.equals(apellidoMaterno, user.apellidoMaterno) && Objects.equals(email, user.email) && Objects.equals(telefono, user.telefono) && Objects.equals(fechaNacimiento, user.fechaNacimiento);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idUsuario, nombre, apellidoPaterno, apellidoMaterno, email, telefono, fechaNacimiento);
    }
}
