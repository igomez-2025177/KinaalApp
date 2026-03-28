package com.isaigomez.kinalapp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.sql.Date;

@Entity
@Table(name = "ventas")
public class Venta {

    @Id
    @Column(name = "codigo_venta")
    private int codigoVenta;

    @Column(name = "fecha_venta")
    private Date fechaVenta;

    @Column(name = "total")
    private double total;

    @Column
    private int estado;

    @Column(name = "dpi_cliente")
    private String dpiCliente;

    @Column(name = "codigo_usuario")
    private int codigoUsuario;

    public Venta() {

    }

    public Venta(int codigoVenta, Date fechaVenta, double total, int estado, String dpiCliente, int codigoUsuario) {
        this.codigoVenta = codigoVenta;
        this.fechaVenta = fechaVenta;
        this.total = total;
        this.estado = estado;
        this.dpiCliente = dpiCliente;
        this.codigoUsuario = codigoUsuario;
    }

    public int getCodigoVenta() {
        return codigoVenta;
    }

    public void setCodigoVenta(int codigoVenta) {
        this.codigoVenta = codigoVenta;
    }

    public Date getFechaVenta() {
        return fechaVenta;
    }

    public void setFechaVenta(Date fechaVenta) {
        this.fechaVenta = fechaVenta;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public int getEstado() {
        return estado;
    }

    public void setEstado(int estado) {
        this.estado = estado;
    }

    public String getDpiCliente() {
        return dpiCliente;
    }

    public void setDpiCliente(String dpiCliente) {
        this.dpiCliente = dpiCliente;
    } 

    public int getCodigoUsuario() {
        return codigoUsuario;
    }

    public void setCodigoUsuario(int codigoUsuario) {
        this.codigoUsuario = codigoUsuario;
    }
}