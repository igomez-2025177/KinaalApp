document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("productoForm");
    const tabla = document.getElementById("tablaProductos");
    const btnBuscar = document.getElementById("btnBuscarProducto");
    const inputBuscar = document.getElementById("buscarCodigoProducto");

    let modoEdicion = false;
    let idOriginal = null;
    let rolUsuarioActual = "";

    iniciar();

    async function iniciar() {
        await obtenerRolUsuarioActual();
        await cargarProductos();
    }

    async function obtenerRolUsuarioActual() {
        try {
            const res = await fetch("/usuarios/rol");

            if (!res.ok) {
                throw new Error("No se pudo obtener el rol");
            }

            const data = await res.json();
            rolUsuarioActual = (data.rol || "").toUpperCase();
        } catch (error) {
            console.error("Error al obtener rol:", error);
            rolUsuarioActual = "";
        }
    }

    form?.addEventListener("submit", async function (e) {
        e.preventDefault();

        if (modoEdicion && rolUsuarioActual !== "ADMIN") {
            alert("Solo el administrador puede actualizar productos");
            return;
        }

        const producto = {
            codigoProducto: document.getElementById("codigoProducto").value
                ? parseInt(document.getElementById("codigoProducto").value)
                : null,
            nombreProducto: document.getElementById("nombreProducto").value.trim(),
            precio: parseFloat(document.getElementById("precioProducto").value),
            stock: parseInt(document.getElementById("stockProducto").value),
            estado: parseInt(document.getElementById("estadoProducto").value)
        };

        try {
            let res;

            if (modoEdicion) {
                res = await fetch(`/productos/${idOriginal}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(producto)
                });
            } else {
                res = await fetch("/productos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(producto)
                });
            }

            const mensaje = await res.text();

            if (!res.ok) {
                alert(mensaje || "Error al guardar o actualizar producto");
                return;
            }

            resetFormulario();
            await cargarProductos();
            alert(modoEdicion ? "Producto actualizado correctamente" : "Producto guardado correctamente");
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error con el producto");
        }
    });

    btnBuscar?.addEventListener("click", async function () {
        const id = inputBuscar.value.trim();

        if (!id) {
            cargarProductos();
            return;
        }

        try {
            const res = await fetch(`/productos/${id}`);

            if (!res.ok) {
                const mensaje = await res.text();
                alert(mensaje || "Producto no encontrado");
                return;
            }

            const p = await res.json();
            tabla.innerHTML = `
                <tr>
                    <td>${p.codigoProducto}</td>
                    <td>${p.nombreProducto}</td>
                    <td>${formatearQuetzales(p.precio)}</td>
                    <td>${p.stock}</td>
                    <td>${mostrarEstado(p.estado)}</td>
                    <td>${renderAcciones(p)}</td>
                </tr>
            `;
        } catch (error) {
            console.error(error);
            alert("Producto no encontrado");
        }
    });

    async function cargarProductos() {
        try {
            const res = await fetch("/productos");

            if (!res.ok) {
                return;
            }

            const data = await res.json();
            tabla.innerHTML = "";

            data.forEach(p => {
                tabla.innerHTML += `
                    <tr>
                        <td>${p.codigoProducto}</td>
                        <td>${p.nombreProducto}</td>
                        <td>${formatearQuetzales(p.precio)}</td>
                        <td>${p.stock}</td>
                        <td>${mostrarEstado(p.estado)}</td>
                        <td>${renderAcciones(p)}</td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }

    function renderAcciones(p) {
        if (rolUsuarioActual !== "ADMIN") {
            return "";
        }

        return `
            <button type="button" onclick="editarProducto(${p.codigoProducto}, '${escapar(p.nombreProducto)}', ${p.precio}, ${p.stock}, ${p.estado})">Editar</button>
            <button type="button" onclick="eliminarProducto(${p.codigoProducto})">Eliminar</button>
        `;
    }

    function mostrarEstado(estado) {
        return Number(estado) === 1 ? "Activo" : "Inactivo";
    }

    function formatearQuetzales(precio) {
        return "Q " + Number(precio).toFixed(2);
    }

    function resetFormulario() {
        form.reset();
        modoEdicion = false;
        idOriginal = null;
        document.getElementById("codigoProducto").readOnly = false;
        document.getElementById("btnGuardarProducto").textContent = "Guardar Producto";
    }

    function escapar(texto) {
        return String(texto).replace(/'/g, "\\'");
    }

    window.editarProducto = function (codigo, nombre, precio, stock, estado) {
        if (rolUsuarioActual !== "ADMIN") {
            alert("Solo el administrador puede actualizar productos");
            return;
        }

        document.getElementById("codigoProducto").value = codigo;
        document.getElementById("nombreProducto").value = nombre;
        document.getElementById("precioProducto").value = precio;
        document.getElementById("stockProducto").value = stock;
        document.getElementById("estadoProducto").value = estado;

        idOriginal = codigo;
        modoEdicion = true;
        document.getElementById("codigoProducto").readOnly = true;
        document.getElementById("btnGuardarProducto").textContent = "Actualizar Producto";
    };

    window.eliminarProducto = async function (codigo) {
        if (rolUsuarioActual !== "ADMIN") {
            alert("Solo el administrador puede eliminar productos");
            return;
        }

        const confirmado = confirm("¿Deseas eliminar este producto?");

        if (!confirmado) {
            return;
        }

        try {
            const res = await fetch(`/productos/${codigo}`, {
                method: "DELETE"
            });

            const mensaje = await res.text();

            if (!res.ok) {
                alert(mensaje || "Error al eliminar producto");
                return;
            }

            await cargarProductos();
            alert("Producto eliminado correctamente");
        } catch (error) {
            console.error(error);
            alert("Error al eliminar producto");
        }
    };
});