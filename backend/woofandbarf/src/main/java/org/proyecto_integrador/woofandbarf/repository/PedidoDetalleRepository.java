package org.proyecto_integrador.woofandbarf.repository;

import org.proyecto_integrador.woofandbarf.model.PedidoDetalle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoDetalleRepository extends JpaRepository<PedidoDetalle, Integer> {

    // Buscar los detalles de un pedido en especifico
    List<PedidoDetalle> findByIdPedido(Integer idPedido);
}
