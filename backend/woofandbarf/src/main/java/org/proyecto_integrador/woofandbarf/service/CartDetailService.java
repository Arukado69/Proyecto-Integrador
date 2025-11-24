package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.model.CartDetail;
import org.proyecto_integrador.woofandbarf.model.Cart;
import org.proyecto_integrador.woofandbarf.model.Product;
import org.proyecto_integrador.woofandbarf.repository.CartDetailRepository;
import org.proyecto_integrador.woofandbarf.repository.CartRepository;
import org.proyecto_integrador.woofandbarf.repository.ProductRepository;
import org.proyecto_integrador.woofandbarf.exceptions.CartNotFoundException;
import org.proyecto_integrador.woofandbarf.exceptions.ProductNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartDetailService {

    @Autowired
    private CartDetailRepository cartDetailRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private ProductRepository productRepository;

    public CartDetail addProductToCart(Long cartId, Long productId, Integer quantity) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFoundException("Carrito no existe"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Producto no existe"));

        CartDetail detail = new CartDetail();
        detail.setCart(cart);
        detail.setProduct(product);
        detail.setCantidad(quantity);

        // La fecha se pone sola gracias a @PrePersist en el modelo

        return cartDetailRepository.save(detail);
    }
}
