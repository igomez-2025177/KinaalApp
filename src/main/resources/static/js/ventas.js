document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("ventaForm");
    const tabla = document.getElementById("tablaVentas");
    const btnBuscar = document.getElementById("btnBuscarVenta");
    const inputBuscar = document.getElementById("buscarCodigoVenta");

    let modoEdicion = false;
    let idOriginal = null;
    let rolUsuarioActual = "";

    iniciar();

    async function iniciar() {
        await obtenerRolUsuarioActual();
        await cargarVentas();
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
            alert("Solo el administrador puede actualizar ventas");
            return;
        }

        const venta = {
            codigoVenta: document.getElementById("codigoVenta").value
                ? parseInt(document.getElementById("codigoVenta").value)
                : null,
            fechaVenta: document.getElementById("fechaVenta").value,
            total: parseFloat(document.getElementById("totalVenta").value),
            estado: parseInt(document.getElementById("estadoVenta").value),
            dpiCliente: document.getElementById("dpiClienteVenta").value.trim(),
            codigoUsuario: parseInt(document.getElementById("codigoUsuarioVenta").value)
        };

        try {
            let res;

            if (modoEdicion) {
                res = await fetch(`/ventas/${idOriginal}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(venta)
                });
            } else {
                res = await fetch("/ventas", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(venta)
                });
            }

            const mensaje = await res.text();

            if (!res.ok) {
                alert(mensaje || "Error al guardar o actualizar venta");
                return;
            }

            resetFormulario();
            await cargarVentas();
            alert(modoEdicion ? "Venta actualizada correctamente" : "Venta guardada correctamente");
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error con la venta");
        }
    });

    btnBuscar?.addEventListener("click", async function () {
        const id = inputBuscar.value.trim();

        if (!id) {
            cargarVentas();
            return;
        }

        try {
            const res = await fetch(`/ventas/${id}`);

            if (!res.ok) {
                const mensaje = await res.text();
                alert(mensaje || "Venta no encontrada");
                return;
            }

            const v = await res.json();
            tabla.innerHTML = `
                <tr>
                    <td>${v.codigoVenta}</td>
                    <td>${formatearFecha(v.fechaVenta)}</td>
                    <td>${formatearQuetzales(v.total)}</td>
                    <td>${mostrarEstado(v.estado)}</td>
                    <td>${v.dpiCliente}</td>
                    <td>${v.codigoUsuario}</td>
                    <td>${renderAcciones(v)}</td>
                </tr>
            `;
        } catch (error) {
            console.error(error);
            alert("Venta no encontrada");
        }
    });

    async function cargarVentas() {
        try {
            const res = await fetch("/ventas");

            if (!res.ok) {
                return;
            }

            const data = await res.json();
            tabla.innerHTML = "";

            data.forEach(v => {
                tabla.innerHTML += `
                    <tr>
                        <td>${v.codigoVenta}</td>
                        <td>${formatearFecha(v.fechaVenta)}</td>
                        <td>${formatearQuetzales(v.total)}</td>
                        <td>${mostrarEstado(v.estado)}</td>
                        <td>${v.dpiCliente}</td>
                        <td>${v.codigoUsuario}</td>
                        <td>${renderAcciones(v)}</td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error("Error al cargar ventas:", error);
        }
    }

    function renderAcciones(v) {
        if (rolUsuarioActual !== "ADMIN") {
            return "";
        }

        return `
            <button type="button" onclick="editarVenta(${v.codigoVenta}, '${formatearFecha(v.fechaVenta)}', ${v.total}, ${v.estado}, '${v.dpiCliente}', ${v.codigoUsuario})">Editar</button>
            <button type="button" onclick="eliminarVenta(${v.codigoVenta})">Eliminar</button>
        `;
    }

    function mostrarEstado(estado) {
        return Number(estado) === 1 ? "Activo" : "Inactivo";
    }

    function formatearQuetzales(total) {
        return "Q " + Number(total).toFixed(2);
    }

    function formatearFecha(fecha) {
        if (!fecha) return "";
        return fecha.toString().split("T")[0];
    }

    function resetFormulario() {
        form.reset();
        modoEdicion = false;
        idOriginal = null;
        document.getElementById("codigoVenta").readOnly = false;
        document.getElementById("btnGuardarVenta").textContent = "Guardar Venta";
    }

    window.editarVenta = function (codigo, fecha, total, estado, dpiCliente, codigoUsuario) {
        if (rolUsuarioActual !== "ADMIN") {
            alert("Solo el administrador puede actualizar ventas");
            return;
        }

        document.getElementById("codigoVenta").value = codigo;
        document.getElementById("fechaVenta").value = fecha;
        document.getElementById("totalVenta").value = total;
        document.getElementById("estadoVenta").value = estado;
        document.getElementById("dpiClienteVenta").value = dpiCliente;
        document.getElementById("codigoUsuarioVenta").value = codigoUsuario;

        idOriginal = codigo;
        modoEdicion = true;
        document.getElementById("codigoVenta").readOnly = true;
        document.getElementById("btnGuardarVenta").textContent = "Actualizar Venta";
    };

    window.eliminarVenta = async function (codigo) {
        if (rolUsuarioActual !== "ADMIN") {
            alert("Solo el administrador puede eliminar ventas");
            return;
        }

        const confirmado = confirm("¿Deseas eliminar esta venta?");

        if (!confirmado) {
            return;
        }

        try {
            const res = await fetch(`/ventas/${codigo}`, {
                method: "DELETE"
            });

            const mensaje = await res.text();

            if (!res.ok) {
                alert(mensaje || "Error al eliminar venta");
                return;
            }

            await cargarVentas();
            alert("Venta eliminada correctamente");
        } catch (error) {
            console.error(error);
            alert("Error al eliminar venta");
        }
    };
});