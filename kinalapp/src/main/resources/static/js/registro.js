document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");

    form?.addEventListener("submit", async function (e) {
        e.preventDefault();

        try {
            const resUsuarios = await fetch("/usuarios");
            const usuarios = await resUsuarios.json();

            let nuevoCodigo = 1;

            if (usuarios.length > 0) {
                const maxCodigo = Math.max(...usuarios.map(u => u.codigoUsuario));
                nuevoCodigo = maxCodigo + 1;
            }

            const usuario = {
                codigoUsuario: nuevoCodigo,
                username: document.getElementById("usernameUsuario").value,
                password: document.getElementById("passwordUsuario").value,
                email: document.getElementById("emailUsuario").value,
                rol: "Vendedor",
                estado: 1
            };

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