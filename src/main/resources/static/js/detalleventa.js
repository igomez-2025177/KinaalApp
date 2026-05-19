document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("detalleVentaForm");
    const tabla = document.getElementById("tablaDetalleVenta");
    const btnBuscar = document.getElementById("btnBuscarDetalleVenta");
    const inputBuscar = document.getElementById("buscarCodigoDetalleVenta");

    let modoEdicion = false;
    let idOriginal = null;
    let rolUsuarioActual = "";

    iniciar();

    async function iniciar() {
        await obtenerRolUsuarioActual();
        await cargarDetalleVenta();
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
            alert("Solo el administrador puede actualizar detalle venta");
            return;
        }

        const detalle = {
            codigoDetalleVenta: document.getElementById("codigoDetalleVenta").value
                ? parseInt(document.getElementById("codigoDetalleVenta").value)
                : null,
            cantidad: parseInt(document.getElementById("cantidadDetalle").value),
            precioUnitario: parseFloat(document.getElementById("precioUnitarioDetalle").value),
            subtotal: parseFloat(document.getElementById("subtotalDetalle").value),
            codigoProducto: parseInt(document.getElementById("codigoProductoDetalle").value),
            codigoVenta: parseInt(document.getElementById("codigoVentaDetalle").value)
        };

        try {
            let res;

            if (modoEdicion) {
                res = await fetch(`/detalleventa/${idOriginal}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(detalle)
                });
            } else {
                res = await fetch("/detalleventa", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(detalle)
                });
            }

            const mensaje = await res.text();

            if (!res.ok) {
                alert(mensaje || "Error al guardar o actualizar detalle");
                return;
            }

            resetFormulario();
            await cargarDetalleVenta();
            alert(modoEdicion ? "Detalle actualizado correctamente" : "Detalle guardado correctamente");
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error con el detalle de venta");
        }
    });

    btnBuscar?.addEventListener("click", async function () {
        const id = inputBuscar.value.trim();

        if (!id) {
            cargarDetalleVenta();
            return;
        }

        try {
            const res = await fetch(`/detalleventa/${id}`);

            if (!res.ok) {
                const mensaje = await res.text();
                alert(mensaje || "Detalle no encontrado");
                return;
            }

            const d = await res.json();
            tabla.innerHTML = `
                <tr>
                    <td>${d.codigoDetalleVenta}</td>
                    <td>${d.cantidad}</td>
                    <td>${formatearQuetzales(d.precioUnitario)}</td>
                    <td>${formatearQuetzales(d.subtotal)}</td>
                    <td>${d.codigoProducto}</td>
                    <td>${d.codigoVenta}</td>
                    <td>${renderAcciones(d)}</td>
                </tr>
            `;
        } catch (error) {
            console.error(error);
            alert("Detalle no encontrado");
        }
    });

    async function cargarDetalleVenta() {
        try {
            const res = await fetch("/detalleventa");

            if (!res.ok) {
                return;
            }

            const data = await res.json();
            tabla.innerHTML = "";

            data.forEach(d => {
                tabla.innerHTML += `
                    <tr>
                        <td>${d.codigoDetalleVenta}</td>
                        <td>${d.cantidad}</td>
                        <td>${formatearQuetzales(d.precioUnitario)}</td>
                        <td>${formatearQuetzales(d.subtotal)}</td>
                        <td>${d.codigoProducto}</td>
                        <td>${d.codigoVenta}</td>
                        <td>${renderAcciones(d)}</td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error("Error al cargar detalle venta:", error);
        }
    }

    function renderAcciones(d) {
        if (rolUsuarioActual !== "ADMIN") {
            return "";
        }

        return `
            <button type="button" onclick="editarDetalleVenta(${d.codigoDetalleVenta}, ${d.cantidad}, ${d.precioUnitario}, ${d.subtotal}, ${d.codigoProducto}, ${d.codigoVenta})">Editar</button>
            <button type="button" onclick="eliminarDetalleVenta(${d.codigoDetalleVenta})">Eliminar</button>
        `;
    }

    function formatearQuetzales(valor) {
        return "Q " + Number(valor).toFixed(2);
    }

    function resetFormulario() {
        form.reset();
        modoEdicion = false;
        idOriginal = null;
        document.getElementById("codigoDetalleVenta").readOnly = false;
        document.getElementById("btnGuardarDetalleVenta").textContent = "Guardar Detalle";
    }

    window.editarDetalleVenta = function (codigo, cantidad, precioUnitario, subtotal, codigoProducto, codigoVenta) {
        if (rolUsuarioActual !== "ADMIN") {
            alert("Solo el administrador puede actualizar detalle venta");
            return;
        }

        document.getElementById("codigoDetalleVenta").value = codigo;
        document.getElementById("cantidadDetalle").value = cantidad;
        document.getElementById("precioUnitarioDetalle").value = precioUnitario;
        document.getElementById("subtotalDetalle").value = subtotal;
        document.getElementById("codigoProductoDetalle").value = codigoProducto;
        document.getElementById("codigoVentaDetalle").value = codigoVenta;

        idOriginal = codigo;
        modoEdicion = true;
        document.getElementById("codigoDetalleVenta").readOnly = true;
        document.getElementById("btnGuardarDetalleVenta").textContent = "Actualizar Detalle";
    };

    window.eliminarDetalleVenta = async function (codigo) {
        if (rolUsuarioActual !== "ADMIN") {
            alert("Solo el administrador puede eliminar detalle venta");
            return;
        }

        const confirmado = confirm("¿Deseas eliminar este detalle de venta?");

        if (!confirmado) {
            return;
        }

        try {
            const res = await fetch(`/detalleventa/${codigo}`, {
                method: "DELETE"
            });

            const mensaje = await res.text();

            if (!res.ok) {
                alert(mensaje || "Error al eliminar detalle de venta");
                return;
            }

            await cargarDetalleVenta();
            alert("Detalle eliminado correctamente");
        } catch (error) {
            console.error(error);
            alert("Error al eliminar detalle de venta");
        }
    };
});