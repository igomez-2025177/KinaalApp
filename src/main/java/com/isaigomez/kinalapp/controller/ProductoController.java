package com.isaigomez.kinalapp.controller;

import com.isaigomez.kinalapp.entity.Producto;
import com.isaigomez.kinalapp.repository.ProductoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoRepository repo;

    public ProductoController(ProductoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<Producto> listar() {
        return repo.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> guardar(@RequestBody Producto p) {
        try {
            if (p.getNombreProducto() == null || p.getNombreProducto().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El nombre del producto es obligatorio");
            }

            if (p.getPrecio() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El precio es obligatorio");
            }

            if (p.getStock() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El stock es obligatorio");
            }

            if (p.getEstado() == null) {
                p.setEstado(1);
            }

            p.setCodigoProducto(null);
            Producto guardado = repo.save(p);
            return ResponseEntity.ok(guardado);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar producto: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Producto producto) {
        try {
            Producto actual = repo.findById(id).orElse(null);

            if (actual == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Producto no encontrado");
            }

            actual.setNombreProducto(producto.getNombreProducto());
            actual.setPrecio(producto.getPrecio());
            actual.setStock(producto.getStock());
            actual.setEstado(producto.getEstado());

            return ResponseEntity.ok(repo.save(actual));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar producto: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return repo.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Producto no encontrado"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Producto no encontrado");
        }

        repo.deleteById(id);
        return ResponseEntity.ok("Producto eliminado correctamente");
    }
}