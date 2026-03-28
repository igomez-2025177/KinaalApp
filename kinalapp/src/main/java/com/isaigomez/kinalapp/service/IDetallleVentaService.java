package com.isaigomez.kinalapp.service;

import com.isaigomez.kinalapp.entity.DetalleVenta;

import java.util.List;
import java.util.Optional;

public interface IDetalleVentaService {

    /*
     * Interfaz: Es un contrato que dice QUÉ métodos debe tener
     * cualquier servicio de DetalleVenta. No tiene implementación,
     * solo definición de los métodos.
     */

    List<DetalleVenta> listarTodos();

    DetalleVenta guardar(DetalleVenta detalleVenta);

    Optional<DetalleVenta> buscarPorId(int id);

    DetalleVenta actualizar(int id, DetalleVenta detalleVenta);

    void eliminar(int id);

    boolean existePorId(int id);
}