document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const username = loginForm.username.value;
        const password = loginForm.password.value;

        
        const VALID_USERNAME = 'user';
        const VALID_PASSWORD = 'password123'; 

        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            // Login bem-sucedido
            errorMessage.classList.remove('visible');
            // Armazena um sinal de que o usuário está logado
            localStorage.setItem('isLoggedIn', 'true'); 
            // Redireciona para a página principal
            window.location.href = 'index.html'; 
        } else {
            // Login falhou
            errorMessage.textContent = 'Usuário ou senha incorretos.';
            errorMessage.classList.add('visible');
        }
    });
});