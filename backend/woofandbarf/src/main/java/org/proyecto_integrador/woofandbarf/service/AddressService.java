package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.AddressNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Address;
import org.proyecto_integrador.woofandbarf.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    public List<Address> findAll() {
        return addressRepository.findAll();
    }

    public Address findById(Long id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new AddressNotFoundException(id));
    }

    // Opcional: direcciones por usuario (usa el método del repo)
    public List<Address> findByUserId(Long idUsuario) {
        return addressRepository.findByUser_IdUsuario(idUsuario);
    }

    public Address save(Address address) {
        return addressRepository.save(address);
    }

    public void delete(Long id) {
        if (!addressRepository.existsById(id)) {
            throw new AddressNotFoundException(id);
        }
        addressRepository.deleteById(id);
    }
}
