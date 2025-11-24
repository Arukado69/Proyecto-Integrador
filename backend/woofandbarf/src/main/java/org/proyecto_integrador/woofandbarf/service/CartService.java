package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.model.*;
import org.proyecto_integrador.woofandbarf.repository.*;
import org.proyecto_integrador.woofandbarf.exceptions.*; // Asegúrate de tener tus excepciones creadas
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartDetailRepository cartDetailRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    // Obtener todos los carritos
    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    // Crear carrito para un usuario (ID Integer)
    public Cart createCart(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    // Agregar producto al carrito
    // ID de producto es Integer.
    public CartDetail addProductToCart(Integer cartId, Integer productId, Integer quantity) {

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Carrito no encontrado id: " + cartId));

        // El repositorio de productos busca por Long
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        CartDetail detail = new CartDetail();
        detail.setCart(cart);
        detail.setProduct(product);
        detail.setCantidad(quantity);

        return cartDetailRepository.save(detail);
    }
}