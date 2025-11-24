package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.exceptions.ResourceNotFoundException;
import org.proyecto_integrador.woofandbarf.model.PedidoDetalle;
import org.proyecto_integrador.woofandbarf.service.PedidoDetalleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pedido-detalles")
public class PedidoDetalleController {

    private final PedidoDetalleService pedidoDetalleService;

    public PedidoDetalleController(PedidoDetalleService pedidoDetalleService) {
        this.pedidoDetalleService = pedidoDetalleService;
    }

    @GetMapping
    public ResponseEntity<List<PedidoDetalle>> getAll() {
        return ResponseEntity.ok(pedidoDetalleService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDetalle> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(pedidoDetalleService.findById(id));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<PedidoDetalle> create(@RequestBody PedidoDetalle detalle) {
        PedidoDetalle created = pedidoDetalleService.save(detalle);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoDetalle> update(@PathVariable Long id,
                                                @RequestBody PedidoDetalle detalle) {
        try {
            pedidoDetalleService.findById(id);
            PedidoDetalle updated = pedidoDetalleService.save(detalle);
            return ResponseEntity.ok(updated);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            pedidoDetalleService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
