document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("emailUsuario").value.trim();
        const username = document.getElementById("usernameUsuario").value.trim();
        const password = document.getElementById("passwordUsuario").value.trim();
        const submitButton = form.querySelector("button[type='submit']");

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
            const usuarios = resUsuarios.ok ? await resUsuarios.json() : [];

            let nuevoCodigo = 1;
            if (usuarios.length > 0) {
                const maxCodigo = Math.max(...usuarios.map(u => u.codigoUsuario));
                nuevoCodigo = maxCodigo + 1;
            }

            const usuario = {
                codigoUsuario: nuevoCodigo,
                username: username,
                password: password,
                email: email
            };

            const res = await fetch("/usuarios/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });

            if (res.status === 409) {
                const mensaje = await res.text();
                alert(mensaje);
                return;
            }

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