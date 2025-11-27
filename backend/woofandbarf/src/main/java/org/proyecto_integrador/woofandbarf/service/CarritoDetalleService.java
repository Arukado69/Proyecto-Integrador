package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.DetalleNotFoundException;
import org.proyecto_integrador.woofandbarf.exceptions.PedidoNotFoundException;
import org.proyecto_integrador.woofandbarf.model.CarritoDetalle;
import org.proyecto_integrador.woofandbarf.repository.CarritoDetalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarritoDetalleService {
    @Autowired
    private CarritoDetalleRepository carritoDetalleRepository;

    //metodo para listar productos
    public List<CarritoDetalle> listarCarritoDetalle(){
        return carritoDetalleRepository.findAll();
    }

    //metodo para buscar por idCarrito
    public CarritoDetalle findById(Integer id){
        return carritoDetalleRepository.findById(id)
                .orElseThrow(() -> new DetalleNotFoundException(id));
    }

    //metodo para crear detalle
    public CarritoDetalle crearCarritoDetalle(CarritoDetalle newCarritoDetalle){
        return carritoDetalleRepository.save(newCarritoDetalle);

    }

    //metodo para eliminar un carritoDetalle
    public void eliminarCarritoDetalle(Integer id){
        if (carritoDetalleRepository.existsById(id)){
            carritoDetalleRepository.deleteById(id);
        }
        throw  new PedidoNotFoundException(id);
    }
    //metodo para modificar detalle
    public CarritoDetalle modificarDetalle(CarritoDetalle carritoDetalle, Integer id){
        return carritoDetalleRepository.findById(id)
                .map(detalleMap -> {
                    detalleMap.setCantidad(carritoDetalle.getCantidad());
                    detalleMap.setProducto(carritoDetalle.getProducto());
                    return carritoDetalleRepository.save(detalleMap);
                })
                .orElseThrow(() -> new DetalleNotFoundException(id));
    }



}
