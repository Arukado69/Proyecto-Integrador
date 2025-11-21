package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.ResourceNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Pedido;
import org.proyecto_integrador.woofandbarf.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoService {
    private final PedidoRepository pedidoRepository;

    @Autowired
    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    // Obtener los pedidos
    public List<Pedido> getPedido() {
        return pedidoRepository.findAll();
    }

    // Crear pedido
    public Pedido createPedido(Pedido newPedido) {
        return pedidoRepository.save(newPedido);
    }

    // Buscar por id
    public Pedido findById(Integer idPedido) {
        return pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado: " + idPedido));
    }

    // Eliminar pedido
    public void deletePedido(Integer idPedido) {
        if (pedidoRepository.existsById(idPedido)) {
            pedidoRepository.deleteById(idPedido);
        } else {
            throw new ResourceNotFoundException("Pedido no encontrado: " + idPedido);
        }
    }

    // Actualizar todos los campos del pedido
    public Pedido updatePedido(Pedido pedido, Integer idPedido) {
        return pedidoRepository.findById(idPedido)
                .map(pedidoMap -> {
                    pedidoMap.setIdUsuario(pedido.getIdUsuario());
                    pedidoMap.setDireccionEnvio(pedido.getDireccionEnvio());
                    pedidoMap.setTotalVenta(pedido.getTotalVenta());
                    pedidoMap.setNumeroRastreador(pedido.getNumeroRastreador());
                    pedidoMap.setFechaCreacion(pedido.getFechaCreacion());
                    return pedidoRepository.save(pedidoMap);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado: " + idPedido));
    }
}
