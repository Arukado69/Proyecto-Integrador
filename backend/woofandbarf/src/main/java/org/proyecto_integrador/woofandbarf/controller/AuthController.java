package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.interfaces.IUsuarioService;
import org.proyecto_integrador.woofandbarf.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints para registro y login.
 * Usados por las pantallas de inicio de sesión y registro.
 *
 *  - POST /auth/register
 *  - POST /auth/login
 */
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private IUsuarioService usuarioService;

    @GetMapping
    public List<Usuario> obtenerUsuarios(){
        return usuarioService.listar();
    }

    /**
     * Registro de usuario.
     * El frontend debe enviar un JSON compatible con Usuario (nombre, apellidos, email, password, etc.)
     */
    @PostMapping("/register")
    public Usuario register(@RequestBody Usuario usuario) {
        return usuarioService.registrar(usuario);
    }

    /**
     * Login de usuario.
     * El frontend debe enviar:
     * {
     *   "email": "correo@ejemplo.com",
     *   "password": "1234"
     * }
     */
    @PostMapping("/login")
    public Usuario login(@RequestBody LoginRequest request) {
        return usuarioService.login(request.getEmail(), request.getPassword());
    }

    /**
     * Clase interna para recibir el cuerpo del login.
     * No es un DTO formal, solo un contenedor mínimo para el JSON.
     */
    public static class LoginRequest {
        private String email;
        private String password;

        // Getters y setters
        public String getEmail() {
            return email;
        }
        public void setEmail(String email) {
            this.email = email;
        }
        public String getPassword() {
            return password;
        }
        public void setPassword(String password) {
            this.password = password;
        }
    }
}

