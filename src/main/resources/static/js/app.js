document.addEventListener("DOMContentLoaded", function () {
    console.log("KinalApp cargado correctamente");

    const forms = document.querySelectorAll("form");

    forms.forEach(form => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("Formulario enviado correctamente");
        });
    });
});