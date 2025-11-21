package org.proyecto_integrador.woofandbarf.service;

import org.proyecto_integrador.woofandbarf.exceptions.UserNotFoundException;
import org.proyecto_integrador.woofandbarf.model.User;
import org.proyecto_integrador.woofandbarf.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    //inyectando userRepository
    private final UserRepository userRepository;
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    //Metodo para recuperar usuarios

    public List<User> getUsers(){
        return userRepository.findAll(); //este metodo findAll se hereda de JpaRepository de la interface
    }

    //Metodo para crear usuarios

    public User createUser(User newUser){
        return userRepository.save(newUser); // save tambien se hereda de JpaRepository y guarda una entidad
    }

    //Metodo para buscar por email o telefono

    public User findByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public User findByTelefono(String telefono){
        return userRepository.findByTelefono(telefono);
    }

    //Metodo para buscar por Id
    public User findById(Integer id){
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    //Metodo para eliminar por id
    public Void deleteUser(Integer id){
        if (userRepository.existsById(id)){
            userRepository.deleteById(id);
        }else {
            throw new UserNotFoundException(id);
        }
       return null;
    }

    //Metodo para actualizar usuarios
    public User updateUser(User user, Integer id){
        return userRepository.findById(id)
                .map(userMap -> {
                    userMap.setNombre(user.getNombre());
                    userMap.setApellidoPaterno(user.getApellidoPaterno());
                    userMap.setApellidoMaterno(user.getApellidoMaterno());
                    userMap.setTelefono(user.getTelefono());
                    userMap.setEmail(user.getEmail());
                    userMap.setFechaNacimiento(user.getFechaNacimiento());
                    return userRepository.save(userMap);
                })
                .orElseThrow(() -> new UserNotFoundException(id));
    }
}
