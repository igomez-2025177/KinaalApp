document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const emailInput = document.getElementById("emailUsuario");
        const usernameInput = document.getElementById("usernameUsuario");
        const passwordInput = document.getElementById("passwordUsuario");
        const submitButton = form.querySelector("button[type='submit']");

        const email = emailInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !username || !password) {
            alert("Todos los campos son obligatorios");
            return;
        }

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Creando cuenta...";
            }

            const resUsuarios = await fetch("/usuarios");
            if (!resUsuarios.ok) {
                throw new Error("No se pudo obtener la lista de usuarios");
            }

            const usuarios = await resUsuarios.json();

            const usuarioExistente = usuarios.find(u => u.username === username);
            if (usuarioExistente) {
                alert("Ese nombre de usuario ya existe");
                return;
            }

            let nuevoCodigo = 1;

            if (usuarios.length > 0) {
                const maxCodigo = Math.max(...usuarios.map(u => u.codigoUsuario));
                nuevoCodigo = maxCodigo + 1;
            }

            const usuario = {
                codigoUsuario: nuevoCodigo,
                username: username,
                password: password,
                email: email,
                rol: "USER",
                estado: 1
            };

            const res = await fetch("/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });

            if (!res.ok) {
                const mensaje = await res.text();
                console.error("Error al registrar usuario:", mensaje);
                throw new Error("No se pudo crear la cuenta");
            }

            alert("Cuenta creada correctamente");
            window.location.href = "/login";
        } catch (error) {
            console.error(error);
            alert("Error al crear la cuenta");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Crear cuenta";
            }
        }
    });
});