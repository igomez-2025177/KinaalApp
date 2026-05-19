package com.isaigomez.kinalapp.controller;

import com.isaigomez.kinalapp.entity.Cliente;
import com.isaigomez.kinalapp.repository.ClienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteRepository repo;

    public ClienteController(ClienteRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<Cliente> listar() {
        return repo.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> guardar(@RequestBody Cliente c) {
        try {
            if (c.getDPICliente() == null || c.getDPICliente().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El DPI del cliente es obligatorio");
            }

            if (c.getNombreCliente() == null || c.getNombreCliente().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El nombre del cliente es obligatorio");
            }

            if (c.getApellidoCliente() == null || c.getApellidoCliente().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El apellido del cliente es obligatorio");
            }

            if (c.getDireccion() == null || c.getDireccion().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("La direccion es obligatoria");
            }

            if (repo.existsById(c.getDPICliente())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Ya existe un cliente con ese DPI");
            }

            if (c.getEstado() == null) {
                c.setEstado(1);
            }

            Cliente guardado = repo.save(c);
            return ResponseEntity.ok(guardado);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar cliente: " + e.getMessage());
        }
    }

    @PutMapping("/{dpi}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizar(@PathVariable String dpi, @RequestBody Cliente cliente) {
        try {
            Cliente actual = repo.findById(dpi).orElse(null);

            if (actual == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Cliente no encontrado");
            }

            actual.setNombreCliente(cliente.getNombreCliente());
            actual.setApellidoCliente(cliente.getApellidoCliente());
            actual.setDireccion(cliente.getDireccion());
            actual.setEstado(cliente.getEstado());

            return ResponseEntity.ok(repo.save(actual));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar cliente: " + e.getMessage());
        }
    }

    @GetMapping("/{dpi}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> buscarPorDpi(@PathVariable String dpi) {
        return repo.findById(dpi)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Cliente no encontrado"));
    }

    @DeleteMapping("/{dpi}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable String dpi) {
        if (!repo.existsById(dpi)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Cliente no encontrado");
        }

        repo.deleteById(dpi);
        return ResponseEntity.ok("Cliente eliminado correctamente");
    }
}