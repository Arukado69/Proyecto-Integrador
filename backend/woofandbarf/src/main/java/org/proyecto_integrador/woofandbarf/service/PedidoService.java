package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.ResourceNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Pedido;
import org.proyecto_integrador.woofandbarf.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }

    public Pedido findById(Long id) {
        return pedidoRepository.findById(id.longValue())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontró el pedido con id: " + id));
    }

    public Pedido save(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    public void delete(Long id) {
        Long key = id.longValue();
        if (!pedidoRepository.existsById(key)) {
            throw new ResourceNotFoundException(
                    "No se encontró el pedido con id: " + id);
        }
        pedidoRepository.deleteById(key);
    }
}
