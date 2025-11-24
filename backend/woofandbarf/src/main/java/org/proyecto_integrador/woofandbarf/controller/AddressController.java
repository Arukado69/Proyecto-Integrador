package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.exceptions.AddressNotFoundException;
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

    @GetMapping
    public ResponseEntity<List<Address>> getAll() {
        return ResponseEntity.ok(addressService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Address> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(addressService.findById(id));
        } catch (AddressNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Address>> getByUser(@PathVariable Long userId) {
        List<Address> addresses = addressService.findByUserId(userId);
        return ResponseEntity.ok(addresses);
    }

    @PostMapping
    public ResponseEntity<Address> create(@RequestBody Address address) {
        Address created = addressService.save(address);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> update(@PathVariable Long id,
                                          @RequestBody Address address) {
        try {
            // Verificamos que exista
            addressService.findById(id);
            Address updated = addressService.save(address);
            return ResponseEntity.ok(updated);
        } catch (AddressNotFoundException e) {
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
