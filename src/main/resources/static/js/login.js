document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".auth-form");
    const usernameInput = document.querySelector('input[name="username"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const loginButton = document.querySelector(".auth-btn");

    if (!form || !usernameInput || !passwordInput) {
        return;
    }

    usernameInput.addEventListener("input", function () {
        this.value = this.value.trimStart();
    });

    passwordInput.addEventListener("input", function () {
        this.value = this.value.trimStart();
    });

    form.addEventListener("submit", function () {
        if (loginButton) {
            loginButton.disabled = true;
            loginButton.textContent = "Ingresando...";
        }
    });
});