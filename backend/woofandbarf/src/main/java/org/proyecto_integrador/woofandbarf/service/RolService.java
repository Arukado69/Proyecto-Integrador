package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.ResourceNotFoundException;
import org.proyecto_integrador.woofandbarf.exceptions.RolNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Rol;
import org.proyecto_integrador.woofandbarf.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolService {

    @Autowired
    private RolRepository rolRepository;

    public List<Rol> findAll() {
        return rolRepository.findAll();
    }

    public Rol findById(Long id) {
        return rolRepository.findById(id.longValue())
                .orElseThrow(() -> new RolNotFoundException(id.intValue()));
    }

    public Rol findByRolPagina(String rolPagina) {
        Rol rol = rolRepository.findByRolPagina(rolPagina);
        if (rol == null) {
            throw new ResourceNotFoundException(
                    "No se encontró el rol con nombre de página: " + rolPagina);
        }
        return rol;
    }

    public Rol save(Rol rol) {
        return rolRepository.save(rol);
    }

    public void delete(Long id) {
        long key = id.longValue();
        if (!rolRepository.existsById(key)) {
            throw new RolNotFoundException((int) key);
        }
        rolRepository.deleteById(key);
    }
}
