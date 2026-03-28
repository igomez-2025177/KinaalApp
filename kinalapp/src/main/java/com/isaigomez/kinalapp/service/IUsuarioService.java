package com.isaigomez.kinalapp.service;

import com.isaigomez.kinalapp.entity.Usuario;
import java.util.List;
import java.util.Optional;

public interface IUsuarioService {

    /*
     * Interfaz: Es un contrato que dice QUÉ métodos debe tener
     * cualquier servicio de Usuarios. No tiene implementación,
     * solo definición de los métodos.
     */

    // Método que devuelve una lista de todos los usuarios
    List<Usuario> listarTodos();
    /*
     * List<Usuario> devuelve una lista de objetos de la entidad Usuario
     */

    // Método que guarda un Usuario en la BD
    Usuario guardar(Usuario usuario);
    // Parámetros: Recibe un objeto Usuario con los datos a guardar

    // Optional - contenedor que puede o no tener valor (evita NullPointerException)
    Optional<Usuario> buscarPorId(int id);

    // Método que actualiza un usuario
    Usuario actualizar(int id, Usuario usuario);
    /*
     * Parámetros:
     *  - id: ID del usuario a actualizar
     *  - usuario: Objeto con los datos nuevos
     * Retorna un objeto de tipo Usuario ya actualizado
     */

    /*
     * Método de tipo void para eliminar un Usuario
     * void: no retorna ningún valor o dato
     * Elimina un usuario por su id
     */
    void eliminar(int id);

    // boolean: retorna true si existe y false si no existe
    boolean existePorId(int id);
}