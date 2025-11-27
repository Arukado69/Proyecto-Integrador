package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.PedidoNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Carrito;
import org.proyecto_integrador.woofandbarf.model.Pedido;
import org.proyecto_integrador.woofandbarf.repository.CarritoRepository;
import org.proyecto_integrador.woofandbarf.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final CarritoRepository carritoRepository;

    // Solo inyectamos aquí en el constructor
    @Autowired
    public PedidoService(PedidoRepository pedidoRepository, CarritoRepository carritoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.carritoRepository = carritoRepository;
    }




    public List<Pedido> obtenerPedidos(){
        return pedidoRepository.findAll();
    }

    public Pedido crearPedido(Pedido newPedido){
        Integer idCarritoBuscado = newPedido.getIdCarrito();

        Carrito carritoExistente = carritoRepository.findById(idCarritoBuscado)
                .orElseThrow(() -> new PedidoNotFoundException(idCarritoBuscado));

        newPedido.setCarrito(carritoExistente);
        newPedido.setTotalVenta(carritoExistente.getTotal());

        return pedidoRepository.save(newPedido);
    }

    public Pedido findById(Integer idPedido){
        return pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new PedidoNotFoundException(idPedido));
    }

    public void eliminarPedido(Integer idPedido){
        if (pedidoRepository.existsById(idPedido)){
            pedidoRepository.deleteById(idPedido);
        } else {
            throw new PedidoNotFoundException(idPedido);
        }
    }
}