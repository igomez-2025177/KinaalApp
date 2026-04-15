document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("detalleVentaForm");
    const tabla = document.getElementById("tablaDetalleVenta");
    const btnBuscar = document.getElementById("btnBuscarDetalleVenta");
    const inputBuscar = document.getElementById("buscarCodigoDetalleVenta");

    let modoEdicion = false;
    let idOriginal = null;

    cargarDetalleVenta();

    form?.addEventListener("submit", async function (e) {
        e.preventDefault();

        const detalle = {
            codigoDetalleVenta: parseInt(document.getElementById("codigoDetalleVenta").value),
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

            if (!res.ok) {
                throw new Error("Error al guardar o actualizar detalle");
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
                throw new Error("Detalle no encontrado");
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
                    <td>
                        <button type="button" onclick="editarDetalleVenta(${d.codigoDetalleVenta}, ${d.cantidad}, ${d.precioUnitario}, ${d.subtotal}, ${d.codigoProducto}, ${d.codigoVenta})">Editar</button>
                        <button type="button" onclick="eliminarDetalleVenta(${d.codigoDetalleVenta})">Eliminar</button>
                    </td>
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
                        <td>
                            <button type="button" onclick="editarDetalleVenta(${d.codigoDetalleVenta}, ${d.cantidad}, ${d.precioUnitario}, ${d.subtotal}, ${d.codigoProducto}, ${d.codigoVenta})">Editar</button>
                            <button type="button" onclick="eliminarDetalleVenta(${d.codigoDetalleVenta})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error("Error al cargar detalle venta:", error);
        }
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
        const confirmado = confirm("¿Deseas eliminar este detalle de venta?");

        if (!confirmado) {
            return;
        }

        try {
            const res = await fetch(`/detalleventa/${codigo}`, {
                method: "DELETE"
            });

            if (res.status === 404) {
                alert("El detalle no existe o ya fue eliminado");
                return;
            }

            if (!res.ok) {
                throw new Error("No se pudo eliminar");
            }

            await cargarDetalleVenta();
            alert("Detalle eliminado correctamente");
        } catch (error) {
            console.error(error);
            alert("Error al eliminar detalle de venta");
        }
    };
});