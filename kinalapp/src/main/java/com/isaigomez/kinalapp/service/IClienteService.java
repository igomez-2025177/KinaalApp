package com.isaigomez.kinalapp.service;

import com.isaigomez.kinalapp.entity.Cliente;
import java.util.List;
import java.util.Optional;

public interface IClienteService {

    /*
     * Interfaz: Es un contrato que dice QUÉ métodos debe tener
     * cualquier servicio de Clientes. No tiene implementación,
     * solo definición de los métodos .
     */

    // Método que devuelve una lista de todos los clientes
    List<Cliente> listarTodos();
    /*
     *  List<Cliente> devuelve una lista de objetos de la entidad Cliente
     */

    // Método que guarda un Cliente en la BD
    Cliente guardar(Cliente cliente);
    // Parámetros: Recibe un objeto Cliente con los datos a guardar

    // Optional - contenedor que puede o no tener valor (evita NullPointerException)
    Optional<Cliente> buscarPorDpi(String dpi);

    // Método que actualiza un cliente
    Cliente actualizar(String dpi, Cliente cliente);
    /*
     * Parámetros ss:
     *  - dpi: DPI del cliente a actualizar
     *  - cliente: Objeto con los datos nuevos
     * Retorna un objeto de tipo Cliente ya actualizado
     */

    /*
     * Método de tipo void para eliminar un Cliente
     * void: no retorna ningún valor o dato
     * Elimina un cliente por su dpi
     */
    void eliminar(String dpi);

    // boolean: retorna true si existe y false si no existe
    boolean existeporDPI(String dpi);
}