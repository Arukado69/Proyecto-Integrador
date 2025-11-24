package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.CartNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Cart;
import org.proyecto_integrador.woofandbarf.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    public List<Cart> findAll() {
        return cartRepository.findAll();
    }

    public Cart findById(Long idCarrito) {
        return cartRepository.findById(idCarrito.longValue())
                .orElseThrow(() -> new CartNotFoundException(
                        "No se encontró el carrito con id: " + idCarrito));
    }

    public Cart save(Cart cart) {
        return cartRepository.save(cart);
    }

    public void delete(Long idCarrito) {
        Long key = idCarrito.longValue();
        if (!cartRepository.existsById(key)) {
            throw new CartNotFoundException(
                    "No se encontró el carrito con id: " + idCarrito);
        }
        cartRepository.deleteById(key);
    }
}
