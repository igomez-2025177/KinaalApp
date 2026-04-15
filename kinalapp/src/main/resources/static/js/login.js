document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");

    form?.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const res = await fetch("/usuarios");
            const usuarios = await res.json();

            const usuarioValido = usuarios.find(u =>
                u.username === username &&
                u.password === password &&
                u.estado === 1
            );

            if (usuarioValido) {
                alert("Inicio de sesión correcto");
                window.location.href = "/";
            } else {
                alert("Usuario, contraseña o estado incorrecto");
            }
        } catch (error) {
            console.error(error);
            alert("Error al iniciar sesión");
        }
    });
});