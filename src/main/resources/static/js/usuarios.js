document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("usuarioForm");
    const tabla = document.getElementById("tablaUsuarios");
    const btnBuscar = document.getElementById("btnBuscarUsuario");
    const inputBuscar = document.getElementById("buscarCodigoUsuario");

    let modoEdicion = false;
    let idOriginal = null;
    let rolUsuarioActual = "";

    iniciar();

    async function iniciar() {
        await obtenerRolUsuarioActual();
        await cargarUsuarios();
    }

    async function obtenerRolUsuarioActual() {
        try {
            const res = await fetch("/usuarios/rol");

            if (!res.ok) {
                throw new Error("No se pudo obtener el rol del usuario actual");
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
            alert("Solo el administrador puede actualizar usuarios");
            return;
        }

        const codigoTexto = document.getElementById("codigoUsuario").value.trim();
        const username = document.getElementById("usernameUsuario").value.trim();
        const password = document.getElementById("passwordUsuario").value.trim();
        const email = document.getElementById("emailUsuario").value.trim();
        const rol = document.getElementById("rolUsuario").value;
        const estadoTexto = document.getElementById("estadoUsuario").value.trim();

        if (!username || !email) {
            alert("Username y correo son obligatorios");
            return;
        }

        if (!modoEdicion && !password) {
            alert("La contraseña es obligatoria");
            return;
        }

        const usuario = {
            codigoUsuario: codigoTexto ? parseInt(codigoTexto) : null,
            username: username,
            password: password,
            email: email,
            rol: rol,
            estado: estadoTexto ? parseInt(estadoTexto) : 1
        };

        try {
            let res;

            if (modoEdicion) {
                res = await fetch(`/usuarios/${idOriginal}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(usuario)
                });
            } else {
                res = await fetch("/usuarios", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(usuario)
                });
            }

            const mensaje = await res.text();

            if (!res.ok) {
                alert(mensaje || "Error al guardar o actualizar usuario");
                return;
            }

            resetFormulario();
            await cargarUsuarios();
            alert(modoEdicion ? "Usuario actualizado correctamente" : "Usuario guardado correctamente");
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error con el usuario");
        }
    });

    btnBuscar?.addEventListener("click", async function () {
        const id = inputBuscar.value.trim();

        if (!id) {
            cargarUsuarios();
            return;
        }

        try {
            const res = await fetch(`/usuarios/${id}`);

            if (!res.ok) {
                const mensaje = await res.text();
                alert(mensaje || "Usuario no encontrado");
                return;
            }

            const u = await res.json();
            tabla.innerHTML = `
                <tr>
                    <td>${u.codigoUsuario}</td>
                    <td>${u.username}</td>
                    <td>********</td>
                    <td>${u.email}</td>
                    <td>${u.rol}</td>
                    <td>${mostrarEstado(u.estado)}</td>
                    <td>${renderAcciones(u)}</td>
                </tr>
            `;
        } catch (error) {
            console.error(error);
            alert("Usuario no encontrado");
        }
    });

    async function cargarUsuarios() {
        try {
            const res = await fetch("/usuarios");
            if (!res.ok) {
                return;
            }

            const data = await res.json();
            tabla.innerHTML = "";

            data.forEach(u => {
                tabla.innerHTML += `
                    <tr>
                        <td>${u.codigoUsuario}</td>
                        <td>${u.username}</td>
                        <td>********</td>
                        <td>${u.email}</td>
                        <td>${u.rol}</td>
                        <td>${mostrarEstado(u.estado)}</td>
                        <td>${renderAcciones(u)}</td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    }

    function renderAcciones(u) {
        if (rolUsuarioActual !== "ADMIN") {
            return "";
        }

        return `
            <button type="button" onclick="editarUsuario(${u.codigoUsuario}, '${escapar(u.username)}', '${escapar(u.email)}', '${escapar(u.rol)}', ${u.estado})">Editar</button>
            <button type="button" onclick="eliminarUsuario(${u.codigoUsuario})">Eliminar</button>
        `;
    }

    function mostrarEstado(estado) {
        return Number(estado) === 1 ? "Activo" : "Inactivo";
    }

    function resetFormulario() {
        form.reset();
        modoEdicion = false;
        idOriginal = null;
        document.getElementById("codigoUsuario").readOnly = false;
        document.getElementById("btnGuardarUsuario").textContent = "Guardar Usuario";
    }

    function escapar(texto) {
        return String(texto).replace(/'/g, "\\'");
    }

    window.editarUsuario = function (codigo, username, email, rol, estado) {
        if (rolUsuarioActual !== "ADMIN") {
            alert("Solo el administrador puede actualizar usuarios");
            return;
        }

        document.getElementById("codigoUsuario").value = codigo;
        document.getElementById("usernameUsuario").value = username;
        document.getElementById("passwordUsuario").value = "";
        document.getElementById("emailUsuario").value = email;
        document.getElementById("rolUsuario").value = rol === "ADMIN" ? "Administrador" : rol === "USER" ? "Usuario" : rol;
        document.getElementById("estadoUsuario").value = estado;

        idOriginal = codigo;
        modoEdicion = true;
        document.getElementById("codigoUsuario").readOnly = true;
        document.getElementById("btnGuardarUsuario").textContent = "Actualizar Usuario";
    };

    window.eliminarUsuario = async function (codigo) {
        if (rolUsuarioActual !== "ADMIN") {
            alert("Solo el administrador puede eliminar usuarios");
            return;
        }

        const confirmado = confirm("¿Deseas eliminar este usuario?");

        if (!confirmado) {
            return;
        }

        try {
            const res = await fetch(`/usuarios/${codigo}`, {
                method: "DELETE"
            });

            const mensaje = await res.text();

            if (!res.ok) {
                alert(mensaje || "Error al eliminar usuario");
                return;
            }

            await cargarUsuarios();
            alert("Usuario eliminado correctamente");
        } catch (error) {
            console.error(error);
            alert("Error al eliminar usuario");
        }
    };
});