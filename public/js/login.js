document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        errorMessage.classList.remove('visible');
        errorMessage.textContent = '';

        try {
            const response = await fetch('https://book-nest-hhh.vercel.app/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password }),
            });

            let data;
            const contentType = response.headers.get('content-type') || '';

            if (contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = { message: await response.text() };
            }

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('isLoggedIn', 'true');
                if (data.name) {
                    localStorage.setItem('userName', data.name);
                }
                if (data.email) {
                    localStorage.setItem('userEmail', data.email);
                }

                window.location.href = 'index.html';
            } else {
                errorMessage.textContent = data.message || 'Erro no login. Verifique seu e-mail e senha.';
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
