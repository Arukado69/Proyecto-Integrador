package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.model.CartDetail;
import org.proyecto_integrador.woofandbarf.service.CartDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart-details")
public class CartDetailController {

    @Autowired
    private CartDetailService cartDetailService;

    // Endpoint: Agregar producto al carrito
    // Ejemplo de uso: POST /api/cart-details?cartId=1&productId=5&quantity=2
    @PostMapping
    public CartDetail addDetail(@RequestParam Long cartId,
                                @RequestParam Long productId,
                                @RequestParam Integer quantity) {
        return cartDetailService.addProductToCart(cartId, productId, quantity);
    }
}