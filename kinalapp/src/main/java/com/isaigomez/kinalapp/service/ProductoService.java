package com.isaigomez.kinalapp.service;

import com.isaigomez.kinalapp.entity.Producto;
import com.isaigomez.kinalapp.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/*
 * Anotacion que registra un bean como un Bean Spring
 * Que en la clase contiene la logica del negocio
 */
@Service
/*
 * Por defecto todos los metodos de esta clase seran transaccionales
 * Una transacccion es que puede o no ocurrir algo
 */
@Transactional
public class ProductoService implements IProductoService {
    /*
     * private: Solo es accesible dentro de la misma clase
     * final: No puede cambiar, es constante
     * ProductoRepository: El repositorio para acceder a la BD
     * Inyeccion de Dependencia ya que Spring nos da el repositorio
     */
    private final ProductoRepository productoRepository;

    /*
     * Constructor: este se ejecuta al crear un objeto
     * Spring pasa el repositorio automaticamente (Inyeccion de Dependencia)
     */
    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
        //Asignar el repositorio a nuestra Variable de clase
    }

    //Indica que se esta implementando un metodo de interfaz
    @Override
    // Optimizar la consulta, solo lectura, para que no bloquee la BD
    @Transactional(readOnly = true)
    public List<Producto> listarTodos() {
        return productoRepository.findAll();
        //findAll() es un metodo de spring que hace el select * from productos
        //Este metodo es de JpaRepository
    }

    @Override
    public Producto guardar(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Producto> buscarPorId(int id) {
        return productoRepository.findById(id);
    }

    @Override
    public Producto actualizar(int id, Producto producto) {
        producto.setCodigoProducto(id);
        return productoRepository.save(producto); 
    }

    @Override
    public void eliminar(int id) {
        productoRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existePorId(int id) {
        return productoRepository.existsById(id);
    }
}
