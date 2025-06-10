document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastroForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    cadastroForm.addEventListener('submit', async (event) => { 
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

        try {
            // -- ADICIONE A REQUISIÇÃO PARA O BACKEND AQUI --
            const response = await fetch('https://book-nest-hhh.vercel.app/api/auth/register', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: newUsername, password: newPassword }),
            });

            const data = await response.json(); 

            if (response.ok) { 
                successMessage.textContent = data.message || 'Cadastro realizado com sucesso! Redirecionando para o login...';
                successMessage.classList.add('visible');
                
                cadastroForm.reset(); 

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else { 
                errorMessage.textContent = data.message || 'Erro no cadastro. Tente novamente.';
                errorMessage.classList.add('visible');
                console.error('Erro de resposta do servidor:', data);
            }
        } catch (error) { 
            errorMessage.textContent = 'Erro de conexão ou servidor. Tente novamente mais tarde.';
            errorMessage.classList.add('visible');
            console.error('Erro na requisição de cadastro:', error);
        }
    });
});