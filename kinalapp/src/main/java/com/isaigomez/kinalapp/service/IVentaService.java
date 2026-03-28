package com.isaigomez.kinalapp.service;

import com.isaigomez.kinalapp.entity.Venta;

import java.util.List;
import java.util.Optional;

public interface IVentaService {

    /*
     * Interfaz: Es un contrato que dice QUÉ métodos debe tener
     * cualquier servicio de Ventas. No tiene implementación,
     * solo definición de los métodos.
     */

    // Método que devuelve una lista de todas las ventas
    List<Venta> listarTodos();
    /*
     * List<Venta> devuelve una lista de objetos de la entidad Venta
     */

    // Método que guarda una Venta en la BD
    Venta guardar(Venta venta);
    // Parámetros: Recibe un objeto Venta con los datos a guardar

    // Optional - contenedor que puede o no tener valor
    Optional<Venta> buscarPorId(int id);

    // Método que actualiza una venta
    Venta actualizar(int id, Venta venta);
    /*
     * Parámetros:
     *  - id: Código de la venta a actualizar
     *  - venta: Objeto con los datos nuevos
     * Retorna un objeto de tipo Venta ya actualizado
     */

    /*
     * Método de tipo void para eliminar una Venta
     * void: no retorna ningún valor o dato
     * Elimina una venta por su id
     */
    void eliminar(int id);

    // boolean: retorna true si existe y false si no existe
    boolean existePorId(int id);
}