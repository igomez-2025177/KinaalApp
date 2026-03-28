package com.isaigomez.kinalapp.service;

import com.isaigomez.kinalapp.entity.Cliente;
import com.isaigomez.kinalapp.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


/*
 * Anotacion que registra un bean como un Bean Spring
 * Que en la clase contiene la logica del negocio
 */
@Service
/*
* Por defecto todos los metodos de esta clase seran transaccionales
* Una transacccion es que puede o no ocurrir algo
 */
@Transactional
public class ClienteService implements IClienteService{
    /*
    * private: Solo es accesible dentro de la misma clase
    * final: No pude cambiar, es constante
    * ClienteRepository: El repositorio para acceder a la BD
    * Inyeccion de Dependencia ya que Spring nos da el repositorio
     */
    private final ClienteRepository clienteRepository;

    /*
    * Constructor: este se ejecuta al crear un objeto
    * Spring pasa el repositori automaticamente (Inyeccion de Dependencia)
     */
    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
        //Asignar el repositorio a nuestra Variable de clase
    }

    //Indica que se esta implementando un metodo de interfaz
    @Override
    // Optimizar la consulta, solo lectura,para que no bloquee la BD
    @Transactional(readOnly = true)
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
        //findAll() es un metodo de spring que hace el select * from Clientes
        //Este metodo de JPARepository
    }

    @Override
    public Cliente guardar(Cliente cliente) {
        return null;
    }

    @Override
    public Optional<Cliente> buscarPorDpi(String dpi) {
        return Optional.empty();
    }

    @Override
    public Cliente actualizar(String dpi, Cliente cliente) {
        return null;
    }

    @Override
    public void eliminar(String doi) {

    }

    @Override
    public boolean existeporDPI(String dpi) {
        return false;
    }
}
