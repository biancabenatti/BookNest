document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        const username = loginForm.username.value;
        const password = loginForm.password.value;

        // Limpa mensagens anteriores
        errorMessage.classList.remove('visible');
        errorMessage.textContent = '';

        // Pega a lista de usuários do localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Encontra o usuário
        const foundUser = users.find(user => user.username === username && user.password === password);

        if (foundUser) {
            // Login bem-sucedido
            localStorage.setItem('isLoggedIn', 'true'); 
            window.location.href = 'index.html'; 
        } else {
            // Login falhou
            errorMessage.textContent = 'Usuário ou senha incorretos.';
            errorMessage.classList.add('visible');
        }
    });
});