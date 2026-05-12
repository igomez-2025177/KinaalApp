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

            const usuario = {
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
                alert(mensaje || "El nombre de usuario ya existe");
                return;
            }

            if (!res.ok) {
                const mensaje = await res.text();
                console.error("Error al crear cuenta:", mensaje);
                alert("Error al crear la cuenta");
                return;
            }

            alert("Cuenta creada correctamente");
            window.location.href = "/login";
        } catch (error) {
            console.error(error);
            alert("Error al crear la cuenta");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "REGISTRARME";
            }
        }
    });
});