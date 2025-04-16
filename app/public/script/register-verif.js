document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('check');
    const birthdate = document.getElementById('birthdate');
    const errorPassword = document.getElementById('verifyPassword');
    const errorPasswordAdd = document.createElement('p');
    const errorAge = document.getElementById('verifyAge');
    const errorAgeAdd = document.createElement('p');
    errorPasswordAdd.className = 'text-xs italic text-red-500';
    errorPassword.appendChild(errorPasswordAdd);
    errorAgeAdd.className = 'text-xs italic text-red-500';
    errorAge.appendChild(errorAgeAdd);
    form.addEventListener('submit', (event) => {
        errorPasswordAdd.innerHTML = '';
        errorAgeAdd.innerHTML = '';

        if (password.value !== confirmPassword.value) {
            errorPasswordAdd.innerHTML = 'Les mots de passe ne correspondent pas.';
            event.preventDefault(); // Empeche l'envoie du formulaire
            return;
        }
        if (password.value.length < 8) {
            errorPasswordAdd.innerHTML = 'Le mot de passe doit contenir au moins 8 caractères.';
            event.preventDefault();
            return;
        }
        const birthDateValue = new Date(birthdate.value);
        const today = new Date();
        let age = today.getFullYear() - birthDateValue.getFullYear();
        const monthDifference = today.getMonth() - birthDateValue.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateValue.getDate())) {
            age--;
        }

        if (age < 13) {
            errorAgeAdd.innerHTML = 'Vous devez avoir plus de 13 ans pour vous inscrire.';
            event.preventDefault();
        }
    });
});