package com.isaigomez.kinalapp.service;

import com.isaigomez.kinalapp.entity.Producto;
import java.util.List;
import java.util.Optional;

public interface IProductoService {

    /*
     * Interfaz: Es un contrato que dice QUÉ métodos debe tener
     * cualquier servicio de Productos. No tiene implementación,
     * solo definición de los métodos.
     */

    // Método que devuelve una lista de todos los productos
    List<Producto> listarTodos();
    /*
     * List<Producto> devuelve una lista de objetos de la entidad Producto
     */

    // Método que guarda un Producto en la BD
    Producto guardar(Producto producto);
    // Parámetros: Recibe un objeto Producto con los datos a guardar

    // Optional - contenedor que puede o no tener valor (evita NullPointerException)
    Optional<Producto> buscarPorId(int id);

    // Método que actualiza un producto
    Producto actualizar(int id, Producto producto);
    /*
     * Parámetros:
     *  - id: Código del producto a actualizar
     *  - producto: Objeto con los datos nuevos
     * Retorna un objeto de tipo Producto ya actualizado
     */

    /*
     * Método de tipo void para eliminar un Producto
     * void: no retorna ningún valor o dato
     * Elimina un producto por su id
     */
    void eliminar(int id);

    // boolean: retorna true si existe y false si no existe
    boolean existePorId(int id);
}
