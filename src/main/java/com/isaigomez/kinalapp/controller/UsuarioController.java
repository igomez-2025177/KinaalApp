package com.isaigomez.kinalapp.controller;

import com.isaigomez.kinalapp.entity.Usuario;
import com.isaigomez.kinalapp.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Usuario> listar() {
        return repo.findAll();
    }

    @PostMapping
    public Usuario guardar(@RequestBody Usuario u) {
        u.setPassword(passwordEncoder.encode(u.getPassword()));
        return repo.save(u);
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            System.out.println("Intentando registrar usuario: " + usuario.getUsername());

            if (repo.findByUsername(usuario.getUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("El nombre de usuario ya existe");
            }

            usuario.setRol("USER");
            usuario.setEstado(1);
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

            Usuario guardado = repo.save(usuario);

            System.out.println("Usuario guardado correctamente con código: " + guardado.getCodigoUsuario());

            return ResponseEntity.ok(guardado);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno al crear la cuenta: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable int id, @RequestBody Usuario usuario) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuario no encontrado");
        }

        usuario.setCodigoUsuario(id);

        if (usuario.getPassword() != null && !usuario.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        } else {
            Usuario actual = repo.findById(id).orElse(null);
            if (actual != null) {
                usuario.setPassword(actual.getPassword());
            }
        }

        return ResponseEntity.ok(repo.save(usuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable int id) {
        return repo.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Usuario no encontrado"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable int id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuario no encontrado");
        }

        repo.deleteById(id);
        return ResponseEntity.ok("Usuario eliminado correctamente");
    }
}