document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");
    const CODIGO_ADMIN = "KINAL2026";

    form?.addEventListener("submit", async function (e) {
        e.preventDefault();

        const rolSeleccionado = document.getElementById("rolUsuario").value;

        if (rolSeleccionado === "Administrador") {
            const codigoIngresado = prompt("Ingrese el código para asignar rol Administrador:");

            if (codigoIngresado !== CODIGO_ADMIN) {
                alert("Código incorrecto. No se puede asignar el rol Administrador.");
                return;
            }
        }

        const usuario = {
            codigoUsuario: parseInt(document.getElementById("codigoUsuario").value),
            username: document.getElementById("usernameUsuario").value,
            password: document.getElementById("passwordUsuario").value,
            email: document.getElementById("emailUsuario").value,
            rol: document.getElementById("rolUsuario").value,
            estado: parseInt(document.getElementById("estadoUsuario").value)
        };

        try {
            const res = await fetch("/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario)
            });

            if (!res.ok) {
                throw new Error("No se pudo crear la cuenta");
            }

            alert("Cuenta creada correctamente");
            window.location.href = "/login";
        } catch (error) {
            console.error(error);
            alert("Error al crear la cuenta");
        }
    });
});