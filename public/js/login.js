document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (event) => { 

        const username = loginForm.username.value;
        const password = loginForm.password.value;

        // Limpa mensagens anteriores
        errorMessage.classList.remove('visible');
        errorMessage.textContent = '';

        try {
            // -- ADICIONE A REQUISIÇÃO PARA O BACKEND AQUI --
            const response = await fetch('https://book-nest-hhh.vercel.app/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json(); 

            if (response.ok) { 
      
      
                localStorage.setItem('token', data.token); 
                localStorage.setItem('isLoggedIn', 'true'); 

                // Redireciona para a página principal ou de livros
                window.location.href = 'index.html'; 
            } else { 
                errorMessage.textContent = data.message || 'Erro no login. Verifique seu usuário e senha.';
                errorMessage.classList.add('visible');
                console.error('Erro de resposta do servidor:', data);
            }
        } catch (error) { 
            errorMessage.textContent = 'Erro de conexão ou servidor. Tente novamente mais tarde.';
            errorMessage.classList.add('visible');
            console.error('Erro na requisição de login:', error);
        }
    });
});