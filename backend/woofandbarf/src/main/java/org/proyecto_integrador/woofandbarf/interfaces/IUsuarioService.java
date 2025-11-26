package org.proyecto_integrador.woofandbarf.interfaces;

import org.proyecto_integrador.woofandbarf.model.Usuario;

import java.util.List;

/**
 * Contrato de operaciones de negocio para usuarios.
 */
public interface IUsuarioService {

    Usuario registrar(Usuario usuario);

    Usuario login(String email, String password);

    Usuario obtenerPorId(Integer idUsuario);

    List<Usuario> listar();
}
