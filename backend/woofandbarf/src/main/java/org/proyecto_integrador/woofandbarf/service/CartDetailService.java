package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.ResourceNotFoundException;
import org.proyecto_integrador.woofandbarf.model.CartDetail;
import org.proyecto_integrador.woofandbarf.repository.CartDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartDetailService {

    @Autowired
    private CartDetailRepository cartDetailRepository;

    public List<CartDetail> findAll() {
        return cartDetailRepository.findAll();
    }

    public CartDetail findById(Long id) {
        return cartDetailRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("No se encontró el detalle de carrito con id: " + id)
                );
    }

    public CartDetail save(CartDetail detail) {
        return cartDetailRepository.save(detail);
    }

    public void delete(Long id) {
        if (!cartDetailRepository.existsById(id)) {
            throw new ResourceNotFoundException("No se encontró el detalle de carrito con id: " + id);
        }
        cartDetailRepository.deleteById(id);
    }
}
