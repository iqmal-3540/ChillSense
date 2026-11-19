// Show / Hide Password (skrip biasa, tak bergantung pada Firebase)
document.querySelectorAll('.toggle-password').forEach(function (button) {
    button.addEventListener('click', function () {
        var input = document.getElementById(this.getAttribute('data-target'));
        if (!input) return;

        if (input.type === 'password') {
            input.type = 'text';
            this.textContent = '🔒';
        } else {
            input.type = 'password';
            this.textContent = '👁';
        }
    });
});
