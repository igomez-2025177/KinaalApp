document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("clienteForm");
    const tabla = document.getElementById("tablaClientes");
    const btnBuscar = document.getElementById("btnBuscarCliente");
    const inputBuscar = document.getElementById("buscarDpiCliente");

    let modoEdicion = false;
    let dpiOriginal = null;

    cargarClientes();

    form?.addEventListener("submit", async function (e) {
        e.preventDefault();

        const cliente = {
            DPICliente: document.getElementById("dpiCliente").value,
            nombreCliente: document.getElementById("nombreCliente").value,
            apellidoCliente: document.getElementById("apellidoCliente").value,
            direccion: document.getElementById("direccionCliente").value,
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

            if (!res.ok) {
                throw new Error("Error al guardar/actualizar cliente");
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
                throw new Error("Cliente no encontrado");
            }

            const c = await res.json();
            tabla.innerHTML = `
                <tr>
                    <td>${c.DPICliente}</td>
                    <td>${c.nombreCliente}</td>
                    <td>${c.apellidoCliente}</td>
                    <td>${c.direccion}</td>
                    <td>${mostrarEstado(c.estado)}</td>
                    <td>
                        <button type="button" onclick="editarCliente('${c.DPICliente}', '${c.nombreCliente}', '${c.apellidoCliente}', '${c.direccion}', ${c.estado})">Editar</button>
                        <button type="button" onclick="eliminarCliente('${c.DPICliente}')">Eliminar</button>
                    </td>
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
                        <td>
                            <button type="button" onclick="editarCliente('${c.DPICliente}', '${c.nombreCliente}', '${c.apellidoCliente}', '${c.direccion}', ${c.estado})">Editar</button>
                            <button type="button" onclick="eliminarCliente('${c.DPICliente}')">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error("Error al cargar clientes:", error);
        }
    }

    function mostrarEstado(estado) {
        return estado === 1 ? "Activo" : "Inactivo";
    }

    function resetFormulario() {
        form.reset();
        modoEdicion = false;
        dpiOriginal = null;
        document.getElementById("dpiCliente").readOnly = false;
        document.getElementById("btnGuardarCliente").textContent = "Guardar Cliente";
    }

    window.editarCliente = function (dpi, nombre, apellido, direccion, estado) {
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
        const confirmado = confirm("¿Deseas eliminar este cliente?");

        if (!confirmado) {
            return;
        }

        try {
            const res = await fetch(`/clientes/${dpi}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                throw new Error("No se pudo eliminar");
            }

            await cargarClientes();
            alert("Cliente eliminado correctamente");
        } catch (error) {
            console.error(error);
            alert("Error al eliminar cliente");
        }
    };
});