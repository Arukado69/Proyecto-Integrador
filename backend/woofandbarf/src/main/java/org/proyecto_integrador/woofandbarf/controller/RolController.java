package org.proyecto_integrador.woofandbarf.controller;

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
    //inyectando rolService
    private final RolService rolService;

    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    //mappeo de metodo de getRoles / GET / SIN PATH
    @GetMapping
    public List<Rol> getRoles(){
        return rolService.getRoles();
    }

    //mappeo de createRol / POST / path: /new-rol
    @PostMapping("/new-rol")
    public ResponseEntity<Rol> createRol(@RequestBody Rol newRol){
        Rol rolByRolPagina = rolService.findByRolPagina(newRol.getRolPagina());

        if (rolByRolPagina != null){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(rolByRolPagina);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(rolService.createRol(newRol));
    }

    //mappeo para getById / GET / path: "/id-user/{id}"
    @GetMapping("/id-rol/{id}")
    public ResponseEntity<Rol> getById(@PathVariable Integer id){
        Rol userById = rolService.findbyId(id);
        try {
            return ResponseEntity.status(HttpStatus.OK).body(userById);
        }catch (RolNotFoundException e){
            return ResponseEntity.notFound().build();

        }
    }

    //Mappeo para metodo deleteRol / DELETE/ path: "/delete-rol/{id}"
    @DeleteMapping("/delete-rol/{id}")
    public ResponseEntity<?> deleteRol(@PathVariable Integer id){
        try {
            rolService.deleteRol(id);
            return ResponseEntity.noContent().build();
        } catch (RolNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    //Mappeo de metodo updateRol // PUT // path; "/update-user/{id}"
    @PutMapping("/update-rol/{id}")
    public ResponseEntity<Rol> updateRol(@RequestBody Rol rol, @PathVariable Integer id){
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(rolService.updateRol(rol,id));

        }catch (RolNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }
}

/*Prueba POST
{
    "idPagina": "Administrador"
}
*/