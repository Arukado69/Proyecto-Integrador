package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.exceptions.UserNotFoundException;
import org.proyecto_integrador.woofandbarf.model.User;
import org.proyecto_integrador.woofandbarf.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    //Inyectado UserService
    private final UserService userService;
    //Creando constructor de la inyeccion userService


    public UserController(UserService userService) {
        this.userService = userService;
    }

    //mappeando el metodo de getUsers de UserService
    @GetMapping
    public List<User> findAllUsers(){
        return userService.getUsers(); // getUsers se hereda de UserService
    }

    //Mapeando el metodo de createUser de UserService sin ID fantasma
    //1. Recuperar el username y el email de un newUser
    //2. Luego, debemos evaluar si pertenecen a una instancia existente (if-else)
    //3. Implementar codigos de estado
    //CLASE PARA MANEJAR ESTADOS ES: ResponseEntity <>
    @PostMapping("/new-user")
    public ResponseEntity<User> saveUser(@RequestBody User newUser){
        User userByEmail = userService.findByEmail(newUser.getEmail());
        User userByTelephone = userService.findByTelefono(newUser.getTelefono());
        if (userByEmail != null || userByTelephone != null){
            //lanzar status 409
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        else {
            //Lanza status 201 exito
            return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(newUser));
        }
    }

    //Creando metodo getById
    @GetMapping("/id-user/{id}")
    public ResponseEntity<User> getById(@PathVariable Integer id){
        User userById = userService.findById(id);
        try{
            return ResponseEntity.status(HttpStatus.OK).body(userById);
        }
        catch (UserNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    //metodo eliminar por id
    @DeleteMapping("/delete-user/{id}")
        public ResponseEntity<?> deleteById(@PathVariable Integer id){

        try {
            //estado 204 no content
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        }catch (UserNotFoundException e){
            //estado 404 not found
            return ResponseEntity.notFound().build();
        }
    }
    //metodo para actualizar id //UPDATE == PUT
    @PutMapping("/update-user/{id}")
    public ResponseEntity<User> updateById(@RequestBody User user, @PathVariable Integer id){
        try {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(userService.updateUser(user, id));
        }catch (UserNotFoundException e){
            return ResponseEntity.notFound().build();

        }
    }


}
