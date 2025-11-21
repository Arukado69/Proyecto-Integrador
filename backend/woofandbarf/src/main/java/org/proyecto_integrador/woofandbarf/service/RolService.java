package org.proyecto_integrador.woofandbarf.service;


import org.proyecto_integrador.woofandbarf.exceptions.RolNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Rol;
import org.proyecto_integrador.woofandbarf.repository.RolRepository;
import org.springframework.stereotype.Service;

import javax.management.relation.RoleNotFoundException;
import java.util.List;
@Service
public class RolService {
    //Inyectar repository
    private final RolRepository rolRepository;
    //Constructor de inyeccion

    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    //Metodo para obtener los roles
    public List<Rol> getRoles(){
        return rolRepository.findAll();
    }

    //Metodo para crear un rol
    public Rol createRol(Rol newRol){
        return rolRepository.save(newRol);
    }

    //Metodo para obtener rol por id
    public Rol findbyId(Integer id){
        return rolRepository.findById(id)
                .orElseThrow(() -> new RolNotFoundException(id));
    }

    //Metodo para obtener Rol por rolPagina
    public Rol findByRolPagina(String rolPagina){
        return rolRepository.findByRolPagina(rolPagina);
    }

    //Metodo para eliminar un rol
    public void deleteRol(Integer id){
        if (rolRepository.existsById(id)){
            rolRepository.deleteById(id);
        } else {
            throw new RolNotFoundException(id);
        }
    }

    //Metodo para actualizar un Rol
    public Rol updateRol(Rol rol, Integer id){
        return rolRepository.findById(id)
                .map(rolMap -> {
                    rolMap.setRolPagina(rol.getRolPagina());
                    return rolRepository.save(rolMap);
                })
                .orElseThrow(() -> new RolNotFoundException(id));
    }
}
