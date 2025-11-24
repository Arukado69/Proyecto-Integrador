package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.exceptions.CartNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Cart;
import org.proyecto_integrador.woofandbarf.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/carts")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<List<Cart>> getAll() {
        return ResponseEntity.ok(cartService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cart> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(cartService.findById(id));
        } catch (CartNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Cart> create(@RequestBody Cart cart) {
        Cart created = cartService.save(cart);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cart> update(@PathVariable Long id,
                                       @RequestBody Cart cart) {
        try {
            cartService.findById(id);
            Cart updated = cartService.save(cart);
            return ResponseEntity.ok(updated);
        } catch (CartNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            cartService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (CartNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
