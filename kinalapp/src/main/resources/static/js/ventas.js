document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("ventaForm");
    const tabla = document.getElementById("tablaVentas");
    const btnBuscar = document.getElementById("btnBuscarVenta");
    const inputBuscar = document.getElementById("buscarCodigoVenta");

    let modoEdicion = false;
    let idOriginal = null;

    cargarVentas();

    form?.addEventListener("submit", async function (e) {
        e.preventDefault();

        const venta = {
            codigoVenta: parseInt(document.getElementById("codigoVenta").value),
            fechaVenta: document.getElementById("fechaVenta").value,
            total: parseFloat(document.getElementById("totalVenta").value),
            estado: parseInt(document.getElementById("estadoVenta").value),
            dpiCliente: document.getElementById("dpiClienteVenta").value,
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

            if (!res.ok) {
                throw new Error("Error al guardar o actualizar venta");
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
                throw new Error("Venta no encontrada");
            }

            const v = await res.json();
            tabla.innerHTML = `
                <tr>
                    <td>${v.codigoVenta}</td>
                    <td>${v.fechaVenta}</td>
                    <td>${v.total}</td>
                    <td>${v.estado}</td>
                    <td>${v.dpiCliente}</td>
                    <td>${v.codigoUsuario}</td>
                    <td>
                        <button type="button" onclick="editarVenta(${v.codigoVenta}, '${v.fechaVenta}', ${v.total}, ${v.estado}, '${v.dpiCliente}', ${v.codigoUsuario})">Editar</button>
                        <button type="button" onclick="eliminarVenta(${v.codigoVenta})">Eliminar</button>
                    </td>
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
            const data = await res.json();
            tabla.innerHTML = "";

            data.forEach(v => {
                tabla.innerHTML += `
                    <tr>
                        <td>${v.codigoVenta}</td>
                        <td>${v.fechaVenta}</td>
                        <td>${v.total}</td>
                        <td>${v.estado}</td>
                        <td>${v.dpiCliente}</td>
                        <td>${v.codigoUsuario}</td>
                        <td>
                            <button type="button" onclick="editarVenta(${v.codigoVenta}, '${v.fechaVenta}', ${v.total}, ${v.estado}, '${v.dpiCliente}', ${v.codigoUsuario})">Editar</button>
                            <button type="button" onclick="eliminarVenta(${v.codigoVenta})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error("Error al cargar ventas:", error);
        }
    }

    function resetFormulario() {
        form.reset();
        modoEdicion = false;
        idOriginal = null;
        document.getElementById("codigoVenta").readOnly = false;
        document.getElementById("btnGuardarVenta").textContent = "Guardar Venta";
    }

    window.editarVenta = function (codigo, fecha, total, estado, dpiCliente, codigoUsuario) {
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
        const confirmado = confirm("¿Deseas eliminar esta venta?");

        if (!confirmado) {
            return;
        }

        try {
            const res = await fetch(`/ventas/${codigo}`, {
                method: "DELETE"
            });

            if (res.status === 404) {
                alert("La venta no existe o ya fue eliminada");
                return;
            }

            if (!res.ok) {
                throw new Error("No se pudo eliminar");
            }

            await cargarVentas();
            alert("Venta eliminada correctamente");
        } catch (error) {
            console.error(error);
            alert("Error al eliminar venta");
        }
    };
});