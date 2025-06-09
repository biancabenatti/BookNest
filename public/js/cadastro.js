document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastroForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    cadastroForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const newUsername = cadastroForm.newUsername.value;
        const newPassword = cadastroForm.newPassword.value;
        const confirmPassword = cadastroForm.confirmPassword.value;

       
        errorMessage.classList.remove('visible');
        successMessage.classList.remove('visible');
        errorMessage.textContent = '';
        successMessage.textContent = '';

       
        if (newPassword.length < 6) {
            errorMessage.textContent = 'A senha deve ter pelo menos 6 caracteres.';
            errorMessage.classList.add('visible');
            return;
        }

        if (newPassword !== confirmPassword) {
            errorMessage.textContent = 'As senhas não coincidem.';
            errorMessage.classList.add('visible');
            return;
        }

       
        let users = JSON.parse(localStorage.getItem('users')) || [];

       
        const userExists = users.some(user => user.username === newUsername);
        if (userExists) {
            errorMessage.textContent = 'Nome de usuário já existe. Escolha outro.';
            errorMessage.classList.add('visible');
            return;
        }

        // Adiciona o novo usuário
        users.push({ username: newUsername, password: newPassword }); 
        localStorage.setItem('users', JSON.stringify(users));

        successMessage.textContent = 'Cadastro realizado com sucesso! Redirecionando para o login...';
        successMessage.classList.add('visible');

      
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000); 
    });
});