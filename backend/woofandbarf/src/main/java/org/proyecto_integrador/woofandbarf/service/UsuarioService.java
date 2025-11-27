package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.enums.Rol;
import org.proyecto_integrador.woofandbarf.exceptions.ConflictoException;
import org.proyecto_integrador.woofandbarf.exceptions.RecursoNoEncontradoException;
import org.proyecto_integrador.woofandbarf.exceptions.UserNotFoundException;
import org.proyecto_integrador.woofandbarf.interfaces.IUsuarioService;
import org.proyecto_integrador.woofandbarf.model.Carrito;
import org.proyecto_integrador.woofandbarf.model.Usuario;
import org.proyecto_integrador.woofandbarf.repository.CarritoRepository;
import org.proyecto_integrador.woofandbarf.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementación de las reglas de negocio para usuarios.
 */
@Service
public class UsuarioService implements IUsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CarritoRepository carritoRepository;

    @Override
    public Usuario registrar(Usuario usuario) {
        usuario.setRol(Rol.CLIENTE);

        // Exception
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new ConflictoException("El email ya está registrado");
        }

        usuario.setFechaCreacion(LocalDateTime.now());

        Usuario guardado = usuarioRepository.save(usuario);

        // Crear un carrito vacío para el usuario recién registrado
        Carrito carrito = new Carrito();
        carrito.setUsuario(guardado);
        carrito.setFechaCreacion(LocalDateTime.now());
        carritoRepository.save(carrito);

        return guardado;
    }

    @Override
    public Usuario login(String email, String password) {
        return usuarioRepository.findByEmailAndPassword(email, password)
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));
    }

    @Override
    public Usuario obtenerPorId(Integer idUsuario) {
        return usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
    }

    @Override
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    //eliminar usuario
    public void eliminarUsuario(Integer id){
        if (usuarioRepository.existsById(id)){
            usuarioRepository.deleteById(id);
        }
        else {
            throw new UserNotFoundException(id);
        }
    }

    //modificar usuario
    public Usuario modificarUsuario(Usuario user, Integer id){
        return usuarioRepository.findById(id)
                .map(usermap -> {
                    usermap.setNombre(user.getNombre());
                    usermap.setApellidos(user.getApellidos());
                    usermap.setEmail(user.getEmail());
                    usermap.setDireccion(user.getDireccion());
                    return usuarioRepository.save(usermap);
                })
                .orElseThrow(() -> new UserNotFoundException(id));
    }


}
