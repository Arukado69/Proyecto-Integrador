package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.model.PedidoDetalle;
import org.proyecto_integrador.woofandbarf.service.PedidoDetalleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedido-detalle")
public class PedidoDetalleController {
    private final PedidoDetalleService pedidoDetalleService;

    @Autowired
    public PedidoDetalleController(PedidoDetalleService pedidoDetalleService) {
        this.pedidoDetalleService = pedidoDetalleService;
    }

    // GET: Obtener detalles por ID del pedido
    @GetMapping("/lista-id-pedido/{idPedido}")
    public ResponseEntity<List<PedidoDetalle>> getByPedido(@PathVariable Integer idPedido) {
        return ResponseEntity.ok(pedidoDetalleService.getDetalleByPedido(idPedido));
    }

    // GET: Obtener detalle por su ID del pedido detalle
    @GetMapping("/obtener-pedido-detalle/{idDetalle}")
    public ResponseEntity<PedidoDetalle> getById(@PathVariable Integer idDetalle) {
        return ResponseEntity.ok(pedidoDetalleService.findById(idDetalle));
    }

    // POST: Crear detalle
    @PostMapping("/crear-pedido-detalle")
    public ResponseEntity<PedidoDetalle> create(@RequestBody PedidoDetalle detalle) {
        return ResponseEntity.status(201).body(pedidoDetalleService.createDetalle(detalle));
    }

    // PUT: Actualizar detalle
    @PutMapping("/actualizar-pedido-detalle/{idDetalle}")
    public ResponseEntity<PedidoDetalle> update(
            @PathVariable Integer idDetalle,
            @RequestBody PedidoDetalle detalle
    ) {
        return ResponseEntity.ok(pedidoDetalleService.updateDetalle(detalle, idDetalle));
    }


    // DELETE: Eliminar detalle
    @DeleteMapping("/eliminar-pedido-detalle/{idDetalle}")
    public ResponseEntity<String> delete(@PathVariable Integer idDetalle) {
        pedidoDetalleService.deleteDetalle(idDetalle);
        return ResponseEntity.ok("Detalle eliminado correctamente");
    }
}
