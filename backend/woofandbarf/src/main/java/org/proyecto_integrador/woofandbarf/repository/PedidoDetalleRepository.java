package org.proyecto_integrador.woofandbarf.repository;

import org.proyecto_integrador.woofandbarf.model.PedidoDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoDetalleRepository extends JpaRepository<PedidoDetalle, Long> {
    // Si más adelante quieres buscar por pedido:
    // List<PedidoDetalle> findByPedido_Id(Long pedidoId);
}
