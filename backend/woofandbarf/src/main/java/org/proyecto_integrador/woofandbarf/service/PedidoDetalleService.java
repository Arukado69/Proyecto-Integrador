package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.ResourceNotFoundException;
import org.proyecto_integrador.woofandbarf.model.PedidoDetalle;
import org.proyecto_integrador.woofandbarf.repository.PedidoDetalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoDetalleService {

    @Autowired
    private PedidoDetalleRepository pedidoDetalleRepository;

    public List<PedidoDetalle> findAll() {
        return pedidoDetalleRepository.findAll();
    }

    public PedidoDetalle findById(Long id) {
        return pedidoDetalleRepository.findById(id.longValue())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontró el detalle del pedido con id: " + id));
    }

    public PedidoDetalle save(PedidoDetalle detalle) {
        return pedidoDetalleRepository.save(detalle);
    }

    public void delete(Long id) {
        long key = id.intValue();
        if (!pedidoDetalleRepository.existsById(key)) {
            throw new ResourceNotFoundException(
                    "No se encontró el detalle del pedido con id: " + id);
        }
        pedidoDetalleRepository.deleteById(key);
    }
}
