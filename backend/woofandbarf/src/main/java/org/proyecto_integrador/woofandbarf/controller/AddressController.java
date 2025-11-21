package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.exceptions.AddressNotFoundException;
import org.proyecto_integrador.woofandbarf.exceptions.AlcaldiaNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Address;
import org.proyecto_integrador.woofandbarf.service.AddressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping("/user/{userId}")
    public List<Address> getByUser(@PathVariable Long userId) {
        return addressService.getByUser(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Address> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(addressService.getById(id));
        } catch (AddressNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Address address) {
        try {
            Address created = addressService.create(address);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (AlcaldiaNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Address address) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(addressService.update(id, address));
        } catch (AddressNotFoundException | AlcaldiaNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            addressService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (AddressNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

