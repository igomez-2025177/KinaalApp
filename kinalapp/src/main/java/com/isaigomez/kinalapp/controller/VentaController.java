package com.isaigomez.kinalapp.controller;

import com.isaigomez.kinalapp.entity.Venta;
import com.isaigomez.kinalapp.repository.VentaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ventas")
public class VentaController {

    private final VentaRepository repo;

    public VentaController(VentaRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Venta> listar() {
        return repo.findAll();
    }

    @PostMapping
    public Venta guardar(@RequestBody Venta v) {
        return repo.save(v);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venta> actualizar(@PathVariable int id, @RequestBody Venta venta) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        venta.setCodigoVenta(id);
        return ResponseEntity.ok(repo.save(venta));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> buscarPorId(@PathVariable int id) {
        return repo.findById(id)
                .map(venta -> ResponseEntity.ok(venta))
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