package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.AlcaldiaNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Alcaldia;
import org.proyecto_integrador.woofandbarf.repository.AlcaldiaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlcaldiaService {

    private final AlcaldiaRepository alcaldiaRepository;

    public AlcaldiaService(AlcaldiaRepository alcaldiaRepository) {
        this.alcaldiaRepository = alcaldiaRepository;
    }

    public List<Alcaldia> getAll() {
        return alcaldiaRepository.findAll();
    }

    public Alcaldia getById(Long id) {
        return alcaldiaRepository.findById(id)
                .orElseThrow(() -> new AlcaldiaNotFoundException(id));
    }

    public Alcaldia create(Alcaldia alcaldia) {
        return alcaldiaRepository.save(alcaldia);
    }

    public Alcaldia update(Long id, Alcaldia alcaldia) {
        return alcaldiaRepository.findById(id)
                .map(a -> {
                    a.setName(alcaldia.getName());
                    return alcaldiaRepository.save(a);
                })
                .orElseThrow(() -> new AlcaldiaNotFoundException(id));
    }

    public void delete(Long id) {
        if (!alcaldiaRepository.existsById(id)) {
            throw new AlcaldiaNotFoundException(id);
        }
        alcaldiaRepository.deleteById(id);
    }
}

