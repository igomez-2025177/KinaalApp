package com.isaigomez.kinalapp.controller;

import com.isaigomez.kinalapp.entity.DetalleVenta;
import com.isaigomez.kinalapp.repository.DetalleVentaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<DetalleVenta> listar() {
        return repo.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> guardar(@RequestBody DetalleVenta detalle) {
        try {
            if (detalle.getCantidad() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La cantidad es obligatoria");
            }

            if (detalle.getPrecioUnitario() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El precio unitario es obligatorio");
            }

            if (detalle.getSubtotal() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El subtotal es obligatorio");
            }

            if (detalle.getCodigoProducto() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El producto es obligatorio");
            }

            if (detalle.getCodigoVenta() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La venta es obligatoria");
            }

            return ResponseEntity.ok(repo.save(detalle));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar detalle venta: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody DetalleVenta detalle) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Detalle venta no encontrado");
        }

        detalle.setCodigoDetalleVenta(id);
        return ResponseEntity.ok(repo.save(detalle));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return repo.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Detalle venta no encontrado"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Detalle venta no encontrado");
        }

        repo.deleteById(id);
        return ResponseEntity.ok("Detalle venta eliminado correctamente");
    }
}