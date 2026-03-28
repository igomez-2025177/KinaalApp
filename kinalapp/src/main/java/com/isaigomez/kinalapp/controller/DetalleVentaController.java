package com.isaigomez.kinalapp.controller;

import com.isaigomez.kinalapp.entity.DetalleVenta;
import com.isaigomez.kinalapp.repository.DetalleVentaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/detalleventa")
public class DetalleVentaController {

    private final DetalleVentaRepository repo;

    public DetalleVentaController(DetalleVentaRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<DetalleVenta> listar() {
        return repo.findAll();
    }

    @PostMapping
    public DetalleVenta guardar(@RequestBody DetalleVenta d) {
        return repo.save(d);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DetalleVenta> actualizar(@PathVariable int id, @RequestBody DetalleVenta detalleVenta) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        detalleVenta.setCodigoDetalleVenta(id);
        return ResponseEntity.ok(repo.save(detalleVenta));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetalleVenta> buscarPorId(@PathVariable int id) {
        return repo.findById(id)
                .map(detalleVenta -> ResponseEntity.ok(detalleVenta))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable int id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}