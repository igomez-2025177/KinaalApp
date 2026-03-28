package com.isaigomez.kinalapp.service;

import com.isaigomez.kinalapp.entity.DetalleVenta;
import com.isaigomez.kinalapp.repository.DetalleVentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DetalleVentaService implements IDetalleVentaService {

    private final DetalleVentaRepository detalleVentaRepository;

    public DetalleVentaService(DetalleVentaRepository detalleVentaRepository) {
        this.detalleVentaRepository = detalleVentaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DetalleVenta> listarTodos() {
        return detalleVentaRepository.findAll();
    }

    @Override
    public DetalleVenta guardar(DetalleVenta detalleVenta) {
        return detalleVentaRepository.save(detalleVenta);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DetalleVenta> buscarPorId(int id) {
        return detalleVentaRepository.findById(id);
    }

    @Override
    public DetalleVenta actualizar(int id, DetalleVenta detalleVenta) {
        detalleVenta.setCodigoDetalleVenta(id);
        return detalleVentaRepository.save(detalleVenta);
    }

    @Override
    public void eliminar(int id) {
        detalleVentaRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existePorId(int id) {
        return detalleVentaRepository.existsById(id);
    }
}