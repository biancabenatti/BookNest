
const livros = [
    { titulo: 'O Senhor dos Anéis', categoria: 'Ficção', imagem: '/img/Livro1.webp', estrelas: 0 },
    { titulo: 'A Breve História do Tempo', categoria: 'Ciência', imagem: '/img/Livro2.jpg', estrelas: 0 },
    { titulo: 'A História de Roma', categoria: 'História', imagem: '/img/Livro1.webp', estrelas: 3 },
];

// Função para exibir os livros
function exibirLivros(categoriaFiltro = '') {
    const livrosLista = document.getElementById('livrosLista');
    livrosLista.innerHTML = ''; // Limpa a lista antes de adicionar

    // Filtra os livros pela categoria se especificada
    const livrosFiltrados = categoriaFiltro ? livros.filter(livro => livro.categoria === categoriaFiltro) : livros;

    livrosFiltrados.forEach(livro => {
        const livroDiv = document.createElement('div');
        livroDiv.classList.add('livro');

        livroDiv.innerHTML = `
            <img src="${livro.imagem}" alt="Capa do livro">
            <h3>${livro.titulo}</h3>
            <div class="star-rating" data-titulo="${livro.titulo}" onclick="alterarEstrelas(event, '${livro.titulo}')">
                ${[1, 2, 3, 4, 5].map(i => `
                    <i class="fa fa-star ${livro.estrelas >= i ? 'checked' : ''}" data-estrela="${i}"></i>
                `).join('')}
            </div>
            <button class="delete-btn" onclick="removerLivro('${livro.titulo}')">
                <i class="fa fa-trash"></i>
            </button>
        `;

        livrosLista.appendChild(livroDiv);
    });
}
document.getElementById("capa").addEventListener("change", function() {
    let fileName = this.files.length > 0 ? this.files[0].name : "Nenhum arquivo selecionado";
    document.getElementById("file-name").textContent = fileName;
});

function removerLivro(titulo) {
    const index = livros.findIndex(livro => livro.titulo === titulo);
    if (index !== -1) {
        livros.splice(index, 1);
        exibirLivros(); // Atualiza a lista
    }
}

// Função para alterar as estrelas
function alterarEstrelas(event, titulo) {
    const livro = livros.find(livro => livro.titulo === titulo);
    const estrela = event.target;

    if (estrela.tagName === 'I') {
        const novaClass = estrela.getAttribute('data-estrela');
        livro.estrelas = parseInt(novaClass);

        exibirLivros(); // Recarregar a lista de livros com a nova classificação
    }
}

// Função para salvar o livro 
document.getElementById('salvarLivro').addEventListener('click', () => {
    const titulo = document.getElementById('titulo').value;
    const imagem = document.getElementById('capa').files[0];
    const categoria = document.getElementById('categoria').value;
    const avaliacao = parseInt(document.getElementById('avaliacao').value);

    if (!titulo || !imagem || !categoria || isNaN(avaliacao)) {
        alert('Preencha todos os campos');
        return;
    }

    const novoLivro = {
        titulo,
        imagem: URL.createObjectURL(imagem), // Utiliza a URL da imagem temporária
        categoria,
        estrelas: avaliacao,
        concluido: false,
    };

    livros.push(novoLivro);
    exibirLivros();
    document.getElementById('modal').style.display = 'none'; // Fecha o modal
});

// Função para abrir o modal de adicionar livro
const modal = document.getElementById("modal");
const btnAbrir = document.getElementById("btnAdicionarLivro");
const btnFechar = document.querySelector(".close");

btnAbrir.addEventListener("click", () => {
    modal.style.display = "block";
});

btnAbrir.addEventListener("click", () => {
    // Limpar os campos do modal
    document.getElementById('titulo').value = '';
    document.getElementById('capa').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('avaliacao').value = '';
    document.getElementById("file-name").textContent = "Nenhum arquivo selecionado";

    modal.style.display = "block";
});

// Fechar o modal ao clicar no "X"
btnFechar.addEventListener("click", () => {
    modal.style.display = "none";
});

// Fechar o modal ao clicar fora dele
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Filtra os livros ao selecionar uma categoria no dropdown
document.getElementById('categoriaFiltro').addEventListener('change', (e) => {
    exibirLivros(e.target.value);
});

// Exibe todos os livros ao carregar a página
exibirLivros();

