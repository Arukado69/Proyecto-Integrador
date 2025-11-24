package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.exceptions.AlcaldiaNotFoundException;
import org.proyecto_integrador.woofandbarf.exceptions.ResourceNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Alcaldia;
import org.proyecto_integrador.woofandbarf.service.AlcaldiaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alcaldias")
public class AlcaldiaController {

    private final AlcaldiaService alcaldiaService;

    public AlcaldiaController(AlcaldiaService alcaldiaService) {
        this.alcaldiaService = alcaldiaService;
    }

    @GetMapping
    public ResponseEntity<List<Alcaldia>> getAll() {
        return ResponseEntity.ok(alcaldiaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alcaldia> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(alcaldiaService.findById(id));
        } catch (AlcaldiaNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search/by-name")
    public ResponseEntity<Alcaldia> getByName(@RequestParam("name") String name) {
        try {
            return ResponseEntity.ok(alcaldiaService.findByNombre(name));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Alcaldia> create(@RequestBody Alcaldia alcaldia) {
        Alcaldia created = alcaldiaService.save(alcaldia);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Alcaldia> update(@PathVariable Long id,
                                           @RequestBody Alcaldia alcaldia) {
        try {
            alcaldiaService.findById(id);
            Alcaldia updated = alcaldiaService.save(alcaldia);
            return ResponseEntity.ok(updated);
        } catch (AlcaldiaNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            alcaldiaService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (AlcaldiaNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
