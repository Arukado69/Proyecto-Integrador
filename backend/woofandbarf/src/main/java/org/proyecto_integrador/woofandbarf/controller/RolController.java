package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.exceptions.ResourceNotFoundException;
import org.proyecto_integrador.woofandbarf.exceptions.RolNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Rol;
import org.proyecto_integrador.woofandbarf.service.RolService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
public class RolController {

    private final RolService rolService;

    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    @GetMapping
    public ResponseEntity<List<Rol>> getAll() {
        return ResponseEntity.ok(rolService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rol> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(rolService.findById(id));
        } catch (RolNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search/by-pagina")
    public ResponseEntity<Rol> getByRolPagina(@RequestParam("rolPagina") String rolPagina) {
        try {
            return ResponseEntity.ok(rolService.findByRolPagina(rolPagina));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Rol> create(@RequestBody Rol rol) {
        Rol created = rolService.save(rol);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rol> update(@PathVariable Long id,
                                      @RequestBody Rol rol) {
        try {
            rolService.findById(id);
            Rol updated = rolService.save(rol);
            return ResponseEntity.ok(updated);
        } catch (RolNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            rolService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RolNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
