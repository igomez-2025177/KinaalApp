package com.isaigomez.kinalapp.service;

import com.isaigomez.kinalapp.entity.Venta;
import com.isaigomez.kinalapp.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class VentaService implements IVentaService {

    private final VentaRepository ventaRepository;

    public VentaService(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Venta> listarTodos() {
        return ventaRepository.findAll();
    }

    @Override
    public Venta guardar(Venta venta) {
        return ventaRepository.save(venta);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Venta> buscarPorId(int id) {
        return ventaRepository.findById(id);
    }

    @Override
    public Venta actualizar(int id, Venta venta) {
        venta.setCodigoVenta(id);
        return ventaRepository.save(venta);
    }

    @Override
    public void eliminar(int id) {
        ventaRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existePorId(int id) {
        return ventaRepository.existsById(id);
    }
}