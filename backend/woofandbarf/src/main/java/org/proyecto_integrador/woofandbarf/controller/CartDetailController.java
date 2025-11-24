package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.exceptions.ResourceNotFoundException;
import org.proyecto_integrador.woofandbarf.model.CartDetail;
import org.proyecto_integrador.woofandbarf.service.CartDetailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cart-details")
public class CartDetailController {

    private final CartDetailService cartDetailService;

    public CartDetailController(CartDetailService cartDetailService) {
        this.cartDetailService = cartDetailService;
    }

    @GetMapping
    public ResponseEntity<List<CartDetail>> getAll() {
        return ResponseEntity.ok(cartDetailService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CartDetail> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(cartDetailService.findById(id));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<CartDetail> create(@RequestBody CartDetail detail) {
        CartDetail created = cartDetailService.save(detail);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartDetail> update(@PathVariable Long id,
                                             @RequestBody CartDetail detail) {
        try {
            cartDetailService.findById(id);
            CartDetail updated = cartDetailService.save(detail);
            return ResponseEntity.ok(updated);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            cartDetailService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
