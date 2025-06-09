document.addEventListener('DOMContentLoaded', () => {
    const checkAuth = () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        // Se o usuário NÃO estiver logado, redireciona para a página de login
        if (isLoggedIn !== 'true') {
            console.log('Usuário não logado. Redirecionando para login...');
            window.location.href = 'login.html'; 
            return false; 
        }
        
        console.log('Usuário logado. Prosseguindo para o aplicativo.');
        return true; 
    };

    if (!checkAuth()) {
        return; // Interrompe a execução se não estiver logado
    }

    
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault(); 
            localStorage.removeItem('isLoggedIn'); 
            alert('Você foi desconectado.');
            window.location.href = 'login.html'; 
        });
    }
});