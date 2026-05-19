package com.isaigomez.kinalapp.controller;

import com.isaigomez.kinalapp.entity.Venta;
import com.isaigomez.kinalapp.repository.VentaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<Venta> listar() {
        return repo.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> guardar(@RequestBody Venta venta) {
        try {
            venta.setCodigoVenta(null);
            return ResponseEntity.ok(repo.save(venta));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar venta: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Venta venta) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Venta no encontrada");
        }

        venta.setCodigoVenta(id);
        return ResponseEntity.ok(repo.save(venta));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return repo.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Venta no encontrada"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Venta no encontrada");
        }

        repo.deleteById(id);
        return ResponseEntity.ok("Venta eliminada correctamente");
    }
}