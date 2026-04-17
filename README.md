KinalApp

Sistema de gestión desarrollado en Spring Boot para la administración de clientes, usuarios, productos, ventas y detalle de ventas.
El proyecto permite realizar operaciones CRUD y administrar la información mediante una API REST conectada a MySQL.

Tecnologías Utilizadas
Java 21
Spring Boot 4.0.2
Maven (Gestor de dependencias)
MySQL (Sistema Gestor de Base de Datos)
Spring Data JPA
REST API
Requisitos Previos

Antes de ejecutar el proyecto debes tener instalado:

JDK 21 o superior
Maven
MySQL
IntelliJ IDEA o VS Code (Opcional pero recomendado)
Git
Cómo se Instala y se Ejecuta
1. Clonar el repositorio
   git clone https://github.com/igomez-2025177/KinaalApp.git
2. Entrar al proyecto
   cd KinaalApp
3. Configurar Base de Datos

Crear la base de datos en MySQL:

CREATE DATABASE kinalapp;

Luego configurar el archivo:

application.properties

Ejemplo:

spring.datasource.url=jdbc:mysql://localhost:3306/kinalapp
spring.datasource.username=root
spring.datasource.password=tu_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
4. Ejecutar el Proyecto

Desde IntelliJ:

Abrir proyecto
Ejecutar clase principal

O desde terminal:

mvn spring-boot:run
Estructura del Proyecto
com.isaigomez.kinalapp

controller
Entity
repository
service

KinalAppApplication.java

Endpoints Disponibles

**Clientes**

GET /clientes

POST /clientes

PUT /clientes/{dpi}

GET /clientes/{dpi}

**Usuarios**

GET /usuarios

POST /usuarios

PUT /usuarios/{id}

GET /usuarios/{id}

**Productos**

GET /productos

POST /productos

PUT /productos/{id}

GET /productos/{id}

**Ventas**
GET /ventas

POST /ventas

PUT /ventas/{id}

GET /ventas/{id}

**Detalle Venta**
GET /detalleVenta

POST /detalleVenta

PUT /detalleVenta/{id}

GET /detalleVenta/{id}

**Arquitectura**


El proyecto utiliza arquitectura por capas:

Entity
Repository
Service
Controller

Siguiendo el patrón:

Controller -> Service -> Repository -> Base de Datos
Autor

Isai Gómez
Kinal - Desarrollo Backend
Spring Boot Project