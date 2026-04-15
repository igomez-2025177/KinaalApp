document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("usuarioForm");
    const tabla = document.getElementById("tablaUsuarios");
    const btnBuscar = document.getElementById("btnBuscarUsuario");
    const inputBuscar = document.getElementById("buscarCodigoUsuario");

    let modoEdicion = false;
    let idOriginal = null;

    cargarUsuarios();

    form?.addEventListener("submit", async function (e) {
        e.preventDefault();

        const usuario = {
            codigoUsuario: parseInt(document.getElementById("codigoUsuario").value),
            username: document.getElementById("usernameUsuario").value,
            password: document.getElementById("passwordUsuario").value,
            email: document.getElementById("emailUsuario").value,
            rol: document.getElementById("rolUsuario").value,
            estado: parseInt(document.getElementById("estadoUsuario").value)
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

            if (!res.ok) {
                throw new Error("Error al guardar o actualizar usuario");
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
                throw new Error("Usuario no encontrado");
            }

            const u = await res.json();
            tabla.innerHTML = `
                <tr>
                    <td>${u.codigoUsuario}</td>
                    <td>${u.username}</td>
                    <td>${u.password}</td>
                    <td>${u.email}</td>
                    <td>${u.rol}</td>
                    <td>${u.estado}</td>
                    <td>
                        <button type="button" onclick="editarUsuario(${u.codigoUsuario}, '${u.username}', '${u.password}', '${u.email}', '${u.rol}', ${u.estado})">Editar</button>
                        <button type="button" onclick="eliminarUsuario(${u.codigoUsuario})">Eliminar</button>
                    </td>
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
            const data = await res.json();
            tabla.innerHTML = "";

            data.forEach(u => {
                tabla.innerHTML += `
                    <tr>
                        <td>${u.codigoUsuario}</td>
                        <td>${u.username}</td>
                        <td>${u.password}</td>
                        <td>${u.email}</td>
                        <td>${u.rol}</td>
                        <td>${u.estado}</td>
                        <td>
                            <button type="button" onclick="editarUsuario(${u.codigoUsuario}, '${u.username}', '${u.password}', '${u.email}', '${u.rol}', ${u.estado})">Editar</button>
                            <button type="button" onclick="eliminarUsuario(${u.codigoUsuario})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    }

    function resetFormulario() {
        form.reset();
        modoEdicion = false;
        idOriginal = null;
        document.getElementById("codigoUsuario").readOnly = false;
        document.getElementById("btnGuardarUsuario").textContent = "Guardar Usuario";
    }

    window.editarUsuario = function (codigo, username, password, email, rol, estado) {
        document.getElementById("codigoUsuario").value = codigo;
        document.getElementById("usernameUsuario").value = username;
        document.getElementById("passwordUsuario").value = password;
        document.getElementById("emailUsuario").value = email;
        document.getElementById("rolUsuario").value = rol;
        document.getElementById("estadoUsuario").value = estado;

        idOriginal = codigo;
        modoEdicion = true;
        document.getElementById("codigoUsuario").readOnly = true;
        document.getElementById("btnGuardarUsuario").textContent = "Actualizar Usuario";
    };

    window.eliminarUsuario = async function (codigo) {
        const confirmado = confirm("¿Deseas eliminar este usuario?");

        if (!confirmado) {
            return;
        }

        try {
            const res = await fetch(`/usuarios/${codigo}`, {
                method: "DELETE"
            });

            if (res.status === 404) {
                alert("El usuario no existe o ya fue eliminado");
                return;
            }

            if (!res.ok) {
                throw new Error("No se pudo eliminar");
            }

            await cargarUsuarios();
            alert("Usuario eliminado correctamente");
        } catch (error) {
            console.error(error);
            alert("Error al eliminar usuario");
        }
    };
});