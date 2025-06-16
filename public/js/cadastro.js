document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastroForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    cadastroForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const newName = cadastroForm.newName.value;
        const newEmail = cadastroForm.newEmail.value;
        const newPassword = cadastroForm.newPassword.value;
        const confirmPassword = cadastroForm.confirmPassword.value;

        errorMessage.classList.remove('visible');
        successMessage.classList.remove('visible');
        errorMessage.textContent = '';
        successMessage.textContent = '';

        if (!newName || !newEmail || !newPassword || !confirmPassword) {
            errorMessage.textContent = 'Todos os campos são obrigatórios.';
            errorMessage.classList.add('visible');
            return;
        }
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
        if (!newEmail.includes('@') || !newEmail.includes('.')) {
            errorMessage.textContent = 'Formato de e-mail inválido.';
            errorMessage.classList.add('visible');
            return;
        }

        try {
            const response = await fetch('https://booknest-00je.onrender.com/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newName, email: newEmail, password: newPassword }),
            });

            let data;
            try {
                data = await response.json();
            } catch (err) {
        
                const text = await response.text();
                data = { message: text };
            }

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