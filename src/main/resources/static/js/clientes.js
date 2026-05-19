document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("clienteForm");
    const tabla = document.getElementById("tablaClientes");
    const btnBuscar = document.getElementById("btnBuscarCliente");
    const inputBuscar = document.getElementById("buscarDpiCliente");

    let modoEdicion = false;
    let dpiOriginal = null;
    let rolUsuarioActual = "";

    iniciar();

    async function iniciar() {
        await obtenerRolUsuarioActual();
        await cargarClientes();
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
            alert("Solo el administrador puede actualizar clientes");
            return;
        }

        const cliente = {
            DPICliente: document.getElementById("dpiCliente").value.trim(),
            nombreCliente: document.getElementById("nombreCliente").value.trim(),
            apellidoCliente: document.getElementById("apellidoCliente").value.trim(),
            direccion: document.getElementById("direccionCliente").value.trim(),
            estado: parseInt(document.getElementById("estadoCliente").value)
        };

        try {
            let res;

            if (modoEdicion) {
                res = await fetch(`/clientes/${dpiOriginal}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cliente)
                });
            } else {
                res = await fetch("/clientes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cliente)
                });
            }

            const mensaje = await res.text();

            if (!res.ok) {
                alert(mensaje || "Error al guardar/actualizar cliente");
                return;
            }

            resetFormulario();
            await cargarClientes();
            alert(modoEdicion ? "Cliente actualizado correctamente" : "Cliente guardado correctamente");
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error");
        }
    });

    btnBuscar?.addEventListener("click", async function () {
        const dpi = inputBuscar.value.trim();

        if (!dpi) {
            cargarClientes();
            return;
        }

        try {
            const res = await fetch(`/clientes/${dpi}`);

            if (!res.ok) {
                const mensaje = await res.text();
                alert(mensaje || "Cliente no encontrado");
                return;
            }

            const c = await res.json();
            tabla.innerHTML = `
                <tr>
                    <td>${c.DPICliente}</td>
                    <td>${c.nombreCliente}</td>
                    <td>${c.apellidoCliente}</td>
                    <td>${c.direccion}</td>
                    <td>${mostrarEstado(c.estado)}</td>
                    <td>${renderAcciones(c)}</td>
                </tr>
            `;
        } catch (error) {
            console.error(error);
            alert("Cliente no encontrado");
        }
    });

    async function cargarClientes() {
        try {
            const res = await fetch("/clientes");

            if (!res.ok) {
                return;
            }

            const data = await res.json();
            tabla.innerHTML = "";

            data.forEach(c => {
                tabla.innerHTML += `
                    <tr>
                        <td>${c.DPICliente}</td>
                        <td>${c.nombreCliente}</td>
                        <td>${c.apellidoCliente}</td>
                        <td>${c.direccion}</td>
                        <td>${mostrarEstado(c.estado)}</td>
                        <td>${renderAcciones(c)}</td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error("Error al cargar clientes:", error);
        }
    }

    function renderAcciones(c) {
        if (rolUsuarioActual !== "ADMIN") {
            return "";
        }

        return `
            <button type="button" onclick="editarCliente('${escapar(c.DPICliente)}', '${escapar(c.nombreCliente)}', '${escapar(c.apellidoCliente)}', '${escapar(c.direccion)}', ${c.estado})">Editar</button>
            <button type="button" onclick="eliminarCliente('${escapar(c.DPICliente)}')">Eliminar</button>
        `;
    }

    function mostrarEstado(estado) {
        return Number(estado) === 1 ? "Activo" : "Inactivo";
    }

    function resetFormulario() {
        form.reset();
        modoEdicion = false;
        dpiOriginal = null;
        document.getElementById("dpiCliente").readOnly = false;
        document.getElementById("btnGuardarCliente").textContent = "Guardar Cliente";
    }

    function escapar(texto) {
        return String(texto).replace(/'/g, "\\'");
    }

    window.editarCliente = function (dpi, nombre, apellido, direccion, estado) {
        if (rolUsuarioActual !== "ADMIN") {
            alert("Solo el administrador puede actualizar clientes");
            return;
        }

        document.getElementById("dpiCliente").value = dpi;
        document.getElementById("nombreCliente").value = nombre;
        document.getElementById("apellidoCliente").value = apellido;
        document.getElementById("direccionCliente").value = direccion;
        document.getElementById("estadoCliente").value = estado;

        dpiOriginal = dpi;
        modoEdicion = true;
        document.getElementById("dpiCliente").readOnly = true;
        document.getElementById("btnGuardarCliente").textContent = "Actualizar Cliente";
    };

    window.eliminarCliente = async function (dpi) {
        if (rolUsuarioActual !== "ADMIN") {
            alert("Solo el administrador puede eliminar clientes");
            return;
        }

        const confirmado = confirm("¿Deseas eliminar este cliente?");

        if (!confirmado) {
            return;
        }

        try {
            const res = await fetch(`/clientes/${dpi}`, {
                method: "DELETE"
            });

            const mensaje = await res.text();

            if (!res.ok) {
                alert(mensaje || "Error al eliminar cliente");
                return;
            }

            await cargarClientes();
            alert("Cliente eliminado correctamente");
        } catch (error) {
            console.error(error);
            alert("Error al eliminar cliente");
        }
    };
});