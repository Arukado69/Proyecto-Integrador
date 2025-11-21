package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.AddressNotFoundException;
import org.proyecto_integrador.woofandbarf.exceptions.AlcaldiaNotFoundException;
import org.proyecto_integrador.woofandbarf.model.Address;
import org.proyecto_integrador.woofandbarf.model.Alcaldia;
import org.proyecto_integrador.woofandbarf.repository.AddressRepository;
import org.proyecto_integrador.woofandbarf.repository.AlcaldiaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final AlcaldiaRepository alcaldiaRepository;

    public AddressService(AddressRepository addressRepository, AlcaldiaRepository alcaldiaRepository) {
        this.addressRepository = addressRepository;
        this.alcaldiaRepository = alcaldiaRepository;
    }

    public List<Address> getByUser(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    public Address getById(Long id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new AddressNotFoundException(id));
    }

    public Address create(Address address) {
        Long idAl = address.getAlcaldia().getId();
        Alcaldia a = alcaldiaRepository.findById(idAl)
                .orElseThrow(() -> new AlcaldiaNotFoundException(idAl));
        address.setAlcaldia(a);
        return addressRepository.save(address);
    }

    public Address update(Long id, Address address) {
        return addressRepository.findById(id)
                .map(a -> {
                    a.setUserId(address.getUserId());
                    a.setStreet(address.getStreet());
                    a.setNumber(address.getNumber());
                    a.setPostalCode(address.getPostalCode());

                    Long idAl = address.getAlcaldia().getId();
                    Alcaldia alc = alcaldiaRepository.findById(idAl)
                            .orElseThrow(() -> new AlcaldiaNotFoundException(idAl));
                    a.setAlcaldia(alc);

                    return addressRepository.save(a);
                })
                .orElseThrow(() -> new AddressNotFoundException(id));
    }

    public void delete(Long id) {
        if (!addressRepository.existsById(id)) {
            throw new AddressNotFoundException(id);
        }
        addressRepository.deleteById(id);
    }
}

