package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.ResourceNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Pedido;
import org.proyecto_integrador.woofandbarf.model.PedidoDetalle;
import org.proyecto_integrador.woofandbarf.repository.PedidoDetalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoDetalleService {
    private final PedidoDetalleRepository pedidoDetalleRepository;

    @Autowired
    public PedidoDetalleService(PedidoDetalleRepository pedidoDetalleRepository) {
        this.pedidoDetalleRepository = pedidoDetalleRepository;
    }

    // Obtener todos los detalles de un pedido específico
    public List<PedidoDetalle> getDetalleByPedido(Integer idPedido) {
        return pedidoDetalleRepository.findByIdPedido(idPedido);
    }

    // Buscar por ID
    public PedidoDetalle findById(Integer idDetalle) {
        return pedidoDetalleRepository.findById(idDetalle)
                .orElseThrow(() -> new ResourceNotFoundException("Detalle no encontrado: " + idDetalle));
    }

    // Crear detalle
    public PedidoDetalle createDetalle(PedidoDetalle detalle) {
        return pedidoDetalleRepository.save(detalle);
    }



    // Actualizar detalle
    public PedidoDetalle updateDetalle(PedidoDetalle detalle, Integer idDetalle) {
        return pedidoDetalleRepository.findById(idDetalle)
                .map(detalleMap -> {
                    detalleMap.setIdPedido(detalle.getIdPedido());
                    detalleMap.setIdProducto(detalle.getIdProducto());
                    detalleMap.setCantidad(detalle.getCantidad());
                    detalleMap.setPrecio(detalle.getPrecio());
                    return pedidoDetalleRepository.save(detalleMap);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Detalle no encontrado: " + idDetalle));
    }

    // Eliminar detalle
    public void deleteDetalle(Integer idDetalle) {
        if (pedidoDetalleRepository.existsById(idDetalle)) {
            pedidoDetalleRepository.deleteById(idDetalle);
        } else {
            throw new ResourceNotFoundException("Detalle no encontrado: " + idDetalle);
        }
    }
}
