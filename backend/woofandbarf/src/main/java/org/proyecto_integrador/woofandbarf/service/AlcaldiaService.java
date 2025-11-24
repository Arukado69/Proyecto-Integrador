package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.AlcaldiaNotFoundException;
import org.proyecto_integrador.woofandbarf.exceptions.ResourceNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Alcaldia;
import org.proyecto_integrador.woofandbarf.repository.AlcaldiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlcaldiaService {

    @Autowired
    private AlcaldiaRepository alcaldiaRepository;

    public List<Alcaldia> findAll() {
        return alcaldiaRepository.findAll();
    }

    public Alcaldia findById(Long id) {
        return alcaldiaRepository.findById(id)
                .orElseThrow(() -> new AlcaldiaNotFoundException(id));
    }

    public Alcaldia findByNombre(String nombre) {
        Alcaldia alcaldia = alcaldiaRepository.findByNombre(nombre);
        if (alcaldia == null) {
            throw new ResourceNotFoundException("No se encontró la Alcaldía con nombre: " + nombre);
        }
        return alcaldia;
    }

    public Alcaldia save(Alcaldia alcaldia) {
        return alcaldiaRepository.save(alcaldia);
    }

    public void delete(Long id) {
        if (!alcaldiaRepository.existsById(id)) {
            throw new AlcaldiaNotFoundException(id);
        }
        alcaldiaRepository.deleteById(id);
    }
}
