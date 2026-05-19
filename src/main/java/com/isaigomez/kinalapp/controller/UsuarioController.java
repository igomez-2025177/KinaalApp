package com.isaigomez.kinalapp.controller;

import com.isaigomez.kinalapp.entity.Usuario;
import com.isaigomez.kinalapp.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/rol")
    public ResponseEntity<?> obtenerRol(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
<<<<<<< Updated upstream
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("No hay usuario autenticado");
=======
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
>>>>>>> Stashed changes
        }

        Usuario usuario = repo.findByUsername(authentication.getName()).orElse(null);

        if (usuario == null) {
<<<<<<< Updated upstream
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuario autenticado no encontrado");
=======
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
>>>>>>> Stashed changes
        }

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("username", usuario.getUsername());
        respuesta.put("rol", usuario.getRol());
        return ResponseEntity.ok(respuesta);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<Usuario> listar() {
        return repo.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> guardar(@RequestBody Usuario u) {
        try {
            if (u.getUsername() == null || u.getUsername().isBlank()) {
<<<<<<< Updated upstream
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El username es obligatorio");
            }

            if (u.getPassword() == null || u.getPassword().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La contraseña es obligatoria");
            }

            if (u.getEmail() == null || u.getEmail().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El correo es obligatorio");
=======
                return ResponseEntity.badRequest().body("El username es obligatorio");
            }

            if (u.getPassword() == null || u.getPassword().isBlank()) {
                return ResponseEntity.badRequest().body("La contraseña es obligatoria");
            }

            if (u.getEmail() == null || u.getEmail().isBlank()) {
                return ResponseEntity.badRequest().body("El correo es obligatorio");
>>>>>>> Stashed changes
            }

            if (repo.findByUsername(u.getUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("El nombre de usuario ya existe");
            }

            u.setCodigoUsuario(null);

            if (u.getRol() == null || u.getRol().isBlank()) {
                u.setRol("USER");
            } else if (u.getRol().equalsIgnoreCase("Administrador")) {
                u.setRol("ADMIN");
<<<<<<< Updated upstream
            } else if (u.getRol().equalsIgnoreCase("Usuario")) {
                u.setRol("USER");
            }

            if (u.getEstado() == null) {
=======
            } else {
                u.setRol("USER");
            }

            if (u.getEstado() == 0) {
>>>>>>> Stashed changes
                u.setEstado(1);
            }

            u.setPassword(passwordEncoder.encode(u.getPassword()));
<<<<<<< Updated upstream

            Usuario guardado = repo.save(u);
            return ResponseEntity.ok(guardado);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno al guardar usuario: " + e.getMessage());
=======
            return ResponseEntity.ok(repo.save(u));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar usuario: " + e.getMessage());
>>>>>>> Stashed changes
        }
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
<<<<<<< Updated upstream
            if (usuario.getUsername() == null || usuario.getUsername().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El username es obligatorio");
            }

            if (usuario.getPassword() == null || usuario.getPassword().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La contraseña es obligatoria");
            }

            if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El correo es obligatorio");
            }

=======
>>>>>>> Stashed changes
            if (repo.findByUsername(usuario.getUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("El nombre de usuario ya existe");
            }

            usuario.setCodigoUsuario(null);
            usuario.setRol("USER");
            usuario.setEstado(1);
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

<<<<<<< Updated upstream
            Usuario guardado = repo.save(usuario);
            return ResponseEntity.ok(guardado);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno al crear la cuenta: " + e.getMessage());
=======
            return ResponseEntity.ok(repo.save(usuario));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear la cuenta: " + e.getMessage());
>>>>>>> Stashed changes
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Usuario usuario) {
<<<<<<< Updated upstream
        try {
            Usuario actual = repo.findById(id).orElse(null);

            if (actual == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Usuario no encontrado");
            }

            actual.setUsername(usuario.getUsername());
            actual.setEmail(usuario.getEmail());

            if (usuario.getRol() != null && !usuario.getRol().isBlank()) {
                if (usuario.getRol().equalsIgnoreCase("Administrador")) {
                    actual.setRol("ADMIN");
                } else if (usuario.getRol().equalsIgnoreCase("Usuario")) {
                    actual.setRol("USER");
                } else {
                    actual.setRol(usuario.getRol());
                }
            }

            if (usuario.getEstado() != null) {
                actual.setEstado(usuario.getEstado());
            }

            if (usuario.getPassword() != null && !usuario.getPassword().isBlank()) {
                actual.setPassword(passwordEncoder.encode(usuario.getPassword()));
            }

            return ResponseEntity.ok(repo.save(actual));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno al actualizar usuario: " + e.getMessage());
        }
=======
        Usuario actual = repo.findById(id).orElse(null);

        if (actual == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        actual.setUsername(usuario.getUsername());
        actual.setEmail(usuario.getEmail());

        if (usuario.getRol() != null && !usuario.getRol().isBlank()) {
            if (usuario.getRol().equalsIgnoreCase("Administrador")) {
                actual.setRol("ADMIN");
            } else {
                actual.setRol("USER");
            }
        }

        actual.setEstado(usuario.getEstado());

        if (usuario.getPassword() != null && !usuario.getPassword().isBlank()) {
            actual.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }

        return ResponseEntity.ok(repo.save(actual));
>>>>>>> Stashed changes
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return repo.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
<<<<<<< Updated upstream
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Usuario no encontrado"));
=======
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado"));
>>>>>>> Stashed changes
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        if (!repo.existsById(id)) {
<<<<<<< Updated upstream
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuario no encontrado");
=======
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
>>>>>>> Stashed changes
        }

        repo.deleteById(id);
        return ResponseEntity.ok("Usuario eliminado correctamente");
    }
}