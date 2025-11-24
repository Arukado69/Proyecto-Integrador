package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.model.Cart;
import org.proyecto_integrador.woofandbarf.model.CartDetail;
import org.proyecto_integrador.woofandbarf.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public List<Cart> getAll() {
        return cartService.getAllCarts();
    }

    @PostMapping("/user/{userId}")
    public Cart create(@PathVariable Integer userId) {
        return cartService.createCart(userId);
    }

    @PostMapping("/{cartId}/product/{productId}")
    public CartDetail addProduct(@PathVariable Integer cartId,
                                 @PathVariable Integer productId,
                                 @RequestParam Integer quantity) {
        return cartService.addProductToCart(cartId, productId, quantity);
    }
}
