package com.isaigomez.kinalapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/")
    public String inicio() {
        return "login";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/registro")
    public String registro() {
        return "registro";
    }

    @GetMapping("/index")
    public String index() {
        return "index";
    }

    @GetMapping("/clientes-view")
    public String clientes() {
        return "clientes";
    }

    @GetMapping("/usuarios-view")
    public String usuarios() {
        return "usuarios";
    }

    @GetMapping("/productos-view")
    public String productos() {
        return "productos";
    }

    @GetMapping("/ventas-view")
    public String ventas() {
        return "ventas";
    }

    @GetMapping("/detalleventa-view")
    public String detalleVenta() {
        return "detalleventa";
    }
}