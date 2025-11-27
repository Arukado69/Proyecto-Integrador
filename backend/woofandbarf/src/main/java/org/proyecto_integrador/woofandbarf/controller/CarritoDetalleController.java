package org.proyecto_integrador.woofandbarf.controller;

import org.proyecto_integrador.woofandbarf.exceptions.DetalleNotFoundException;
import org.proyecto_integrador.woofandbarf.model.CarritoDetalle;
import org.proyecto_integrador.woofandbarf.service.CarritoDetalleService;
import org.proyecto_integrador.woofandbarf.service.CarritoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/detalle")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CarritoDetalleController {
    private CarritoDetalleService carritoDetalleService;

    //metodo para mostrar tooodos los detalles
    @GetMapping
    public List<CarritoDetalle> listarDetalle(){
        return carritoDetalleService.listarCarritoDetalle();
    }

    //metodo para mostrar por id
    @GetMapping("/id-detalle/{id}")
    public ResponseEntity<CarritoDetalle> findById(Integer id){
        try {
            CarritoDetalle carritoDetalleById = carritoDetalleService.findById(id);
            return ResponseEntity.ok(carritoDetalleById);
        }catch (DetalleNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }
    //metodo crear
    @PostMapping("/new-detalle")
    public CarritoDetalle crearCarritoDetalle(@RequestBody CarritoDetalle newCarritoDetalle){
        return carritoDetalleService.crearCarritoDetalle(newCarritoDetalle);
    }
    //metodo para eliminar
    @DeleteMapping("/eliminar-pedido/{id}")
    public ResponseEntity<?> eliminarPedido(@PathVariable Integer id){
        try {
            carritoDetalleService.eliminarCarritoDetalle(id);
            return ResponseEntity.noContent().build();
        }catch (DetalleNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/actualizar-detalle/{id}")
    public ResponseEntity<CarritoDetalle> modificarDetalle(@RequestBody CarritoDetalle carritoDetalle, @PathVariable Integer id){
        try {
           return ResponseEntity.status(HttpStatus.CREATED).body(carritoDetalleService.modificarDetalle(carritoDetalle, id));
        } catch (DetalleNotFoundException e){
            return ResponseEntity.notFound().build();
        }
    }

}
