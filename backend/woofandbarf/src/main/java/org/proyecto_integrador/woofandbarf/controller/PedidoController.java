package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.model.Pedido;
import org.proyecto_integrador.woofandbarf.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/pedido")
public class PedidoController {
    private final PedidoService pedidoService;

    @Autowired
    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // Obtener todos los pedidos
    @GetMapping("/listar-pedidos")
    public List<Pedido> getPedidos() {
        return pedidoService.getPedido();
    }

    // Obtener pedido por ID
    @GetMapping("/obtener-pedido/{id}")
    public Pedido findById(@PathVariable Integer id) {
        return pedidoService.findById(id);
    }

    // Crear pedido
    @PostMapping("/crear-pedido")
    public Pedido createPedido(@RequestBody Pedido pedido) {
        return pedidoService.createPedido(pedido);
    }

    // Actualizar pedido
    @PutMapping("/actualizar-pedido/{id}")
    public Pedido updatePedido(@PathVariable Integer id, @RequestBody Pedido pedido) {
        return pedidoService.updatePedido(pedido, id);
    }

    // Eliminar pedido
    @DeleteMapping("/eliminar-pedido/{id}")
    public ResponseEntity<String> deletePedido(@PathVariable Integer id) {
        pedidoService.deletePedido(id);
        return ResponseEntity.ok("Pedido eliminado correctamente");
    }

}
