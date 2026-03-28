package com.isaigomez.kinalapp.controller;

import com.isaigomez.kinalapp.entity.Producto;
import com.isaigomez.kinalapp.repository.ProductoRepository;
import org.springframework.http.ResponseEntity;
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
    public List<Producto> listar() {
        return repo.findAll();
    }

    @PostMapping
    public Producto guardar(@RequestBody Producto p) {
        return repo.save(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable int id, @RequestBody Producto producto) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        producto.setCodigoProducto(id);
        return ResponseEntity.ok(repo.save(producto));
    }

    @GetMapping("/{id}") 
    public ResponseEntity<Producto> buscarPorId(@PathVariable int id) {
        return repo.findById(id)
                .map(producto -> ResponseEntity.ok(producto))
                .orElse(ResponseEntity.notFound().build());
    }
}
