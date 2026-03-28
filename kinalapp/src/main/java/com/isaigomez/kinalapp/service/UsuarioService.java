package com.isaigomez.kinalapp.service;

import com.isaigomez.kinalapp.entity.Usuario;
import com.isaigomez.kinalapp.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService implements IUsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario guardar(Usuario usuario) {
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorId(int id) {
        return Optional.empty();
    }

    @Override
    public Usuario actualizar(int id, Usuario usuario) {
        return null;
    } 

    @Override
    public void eliminar(int id) {

    }

    @Override
    @Transactional(readOnly = true)
    public boolean existePorId(int id) {
        return false;
    }
}
