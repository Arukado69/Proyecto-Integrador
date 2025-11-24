package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.ResourceNotFoundException;
import org.proyecto_integrador.woofandbarf.exceptions.UserNotFoundException;
import org.proyecto_integrador.woofandbarf.model.User;
import org.proyecto_integrador.woofandbarf.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id.longValue())
                .orElseThrow(() -> new UserNotFoundException(id.intValue()));
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public void delete(Long id) {
        long key = id.intValue();
        if (!userRepository.existsById(key)) {
            throw new UserNotFoundException((int) key);
        }
        userRepository.deleteById(key);
    }

    public User findByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException(
                    "No se encontró el usuario con email: " + email);
        }
        return user;
    }

    public User findByTelefono(String telefono) {
        User user = userRepository.findByTelefono(telefono);
        if (user == null) {
            throw new ResourceNotFoundException(
                    "No se encontró el usuario con teléfono: " + telefono);
        }
        return user;
    }
}
