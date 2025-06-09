document.addEventListener('DOMContentLoaded', () => {
    const checkAuth = () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        // Se o usuário NÃO estiver logado, redireciona para a página de login
        if (isLoggedIn !== 'true') {
            console.log('Usuário não logado. Redirecionando para login...');
            window.location.href = 'login.html'; 
            return false; // Indica que o redirecionamento ocorreu
        }
        
        console.log('Usuário logado. Prosseguindo para o aplicativo.');
        return true; // Indica que o usuário está logado e pode continuar
    };

    // Executa a verificação de autenticação imediatamente
    // Se o usuário não estiver logado e for redirecionado, o restante do script.js não será executado.
    if (!checkAuth()) {
        return; // Interrompe a execução se não estiver logado
    }

    // Adiciona o listener para o botão de logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) { // Garante que o botão existe antes de adicionar o listener
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault(); // Impede o comportamento padrão do link (#)
            localStorage.removeItem('isLoggedIn'); // Remove o estado de login
            alert('Você foi desconectado.'); // Alerta opcional
            window.location.href = 'login.html'; // Redireciona para a página de login
        });
    }
});