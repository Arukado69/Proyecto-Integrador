package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.exceptions.PedidoNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Pedido;
import org.proyecto_integrador.woofandbarf.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    // --- CORRECCIÓN AQUÍ ---
    // Usamos el Constructor para inyectar el servicio.
    // Esto asegura que pedidoService NUNCA sea null.
    @Autowired
    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }
    // -----------------------

    @GetMapping
    public List<Pedido> obtenerPedidos(){
        return pedidoService.obtenerPedidos();
    }

    @GetMapping("/id-pedido/{idPedido}")
    public ResponseEntity<Pedido> findById(@PathVariable Integer idPedido){
        try{
            Pedido pedidoById = pedidoService.findById(idPedido);
            return ResponseEntity.ok(pedidoById);
        }catch (PedidoNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/new-pedido")
    public ResponseEntity<?> nuevoPedido(@RequestBody Pedido newPedido){
        try{
            Pedido pedidoGuardado = pedidoService.crearPedido(newPedido);
            return  ResponseEntity.ok(pedidoGuardado);
        }catch (PedidoNotFoundException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete-pedido/{idPedido}")
    public ResponseEntity<?> deleteById(@PathVariable Integer idPedido){
        try {
            pedidoService.eliminarPedido(idPedido);
            return ResponseEntity.noContent().build();
        }catch (PedidoNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

    //metodo para actualizar pedido
    @PutMapping("/modificar-pedido/{id}")
    public ResponseEntity<Pedido> modificarPedido(@RequestBody Pedido pedido, @PathVariable Integer id){
        try {
            return ResponseEntity.ok(pedidoService.modificarPedido(pedido,id));
        }catch (PedidoNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }
}