// Array para armazenar os livros
let livros = [];

// Função para carregar livros do localStorage e do backend
async function carregarLivros() {
    try {
        const livrosSalvos = localStorage.getItem('livros');
        if (livrosSalvos) {
            livros = JSON.parse(livrosSalvos);

            const livrosValidos = [];
            for (const livro of livros) {
                const res = await fetch(`http://localhost:3000/api/livros/${livro._id}`);
                if (res.ok) {
                    livrosValidos.push(livro);
                }
            }

            livros = livrosValidos;
            exibirLivros(livros);
        } else {
            const res = await fetch('http://localhost:3000/api/livros');
            const data = await res.json();
            livros = data;
            exibirLivros(livros);
        }
    } catch (err) {
        console.error('Erro ao carregar livros:', err);
    }
}

// Chama a função para carregar livros ao iniciar a página
carregarLivros();

// Função para formatar datas no formato brasileiro
function formatDateBR(isoString) {
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

// Função para exibir livros na tela
function exibirLivros(livrosParaExibir = [], categoriaFiltro = '') {
    const livrosLista = document.getElementById('livrosLista');
    livrosLista.innerHTML = '';

    const livrosFiltrados = categoriaFiltro
        ? livrosParaExibir.filter(livro => livro.categoria === categoriaFiltro)
        : livrosParaExibir;

    livrosFiltrados.forEach(livro => {
        const livroDiv = document.createElement('div');
        livroDiv.classList.add('livro');

        livroDiv.innerHTML = `
            <div class="livro-info">
                <h3>${livro.titulo}</h3>
                <p><strong></strong> ${livro.descricao || ''}</p>
                </div>
                <div class="livro-info-2">
                <p><strong>Data de Leitura</strong> </br>
                ${livro.data_leitura ? formatDateBR(livro.data_leitura) : ''}</p>
                <p><strong>Categoria:</strong> ${livro.categoria || ''}</p>
                <div class="star-rating" data-titulo="${livro.titulo}" onclick="alterarEstrelas(event, '${livro.titulo}')">
                ${[1, 2, 3, 4, 5].map(i => `
                    <i class="fa fa-star ${livro.estrelas >= i ? 'checked' : ''}" data-estrela="${i}"></i>
                    `).join('')}
            </div>
            </div>
            <button class="delete-btn" onclick="removerLivro('${livro._id}')">
                <i class="fa fa-trash"></i>
            </button>
        `;

        livrosLista.appendChild(livroDiv);
    });
}

// Função para remover livro
async function removerLivro(id) {
    const livro = livros.find(livro => livro._id === id);
    if (!livro) return;

    const confirmDelete = confirm(`Tem certeza que deseja excluir o livro: "${livro.titulo}"?`);
    if (!confirmDelete) return;

    try {
        const res = await fetch(`http://localhost:3000/api/livros/${livro._id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            livros = livros.filter(l => l._id !== livro._id);
            localStorage.setItem('livros', JSON.stringify(livros));
            exibirLivros(livros);
            alert('Livro excluído com sucesso!');
        } else {
            const err = await res.json();
            alert('Erro ao excluir: ' + err.message);
        }
    } catch (err) {
        console.error('Erro ao excluir livro:', err);
        alert('Erro ao conectar com o servidor.');
    }
}

// Função para alterar estrelas
function alterarEstrelas(event, titulo) {
    const livro = livros.find(livro => livro.titulo === titulo);
    const estrela = event.target;

    if (estrela.tagName === 'I') {
        const novaClass = estrela.getAttribute('data-estrela');
        livro.estrelas = parseInt(novaClass);

        localStorage.setItem('livros', JSON.stringify(livros));
        exibirLivros(livros);
    }
}

// Evento para salvar um novo livro
document.getElementById('salvarLivro').addEventListener('click', async () => {
    const payload = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        categoria: document.getElementById('categoria').value,
        avaliacao: parseFloat(document.getElementById('avaliacao').value),
        data_leitura: document.getElementById('dataLeitura').value,
        descricao: document.getElementById('descricao').value
    };

    if (!payload.titulo || !payload.autor || isNaN(payload.avaliacao) 
        || !payload.categoria || !payload.data_leitura || !payload.descricao) {
        return alert('Preencha todos os campos');
    }

    try {
        const res = await fetch('http://localhost:3000/api/livros', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        let result = {};
        if (res.headers.get('content-length') > 0) {
            result = await res.json();
        }

        if (res.ok) {
            alert('Livro salvo com sucesso!');
            document.getElementById('modal').style.display = 'none';

            livros.push(result);
            localStorage.setItem('livros', JSON.stringify(livros));
            exibirLivros(livros);
        } else {
            alert('Erro: ' + (result.message || res.statusText));
        }
    } catch (err) {
        console.error('Fetch error:', err);
        alert('Erro ao salvar livro');
    }
});

// Controle do modal
const modal = document.getElementById("modal");
const btnAbrir = document.getElementById("btnAdicionarLivro");
const btnFechar = document.querySelector(".close");

btnAbrir.addEventListener("click", () => {
    document.getElementById('titulo').value = '';
    document.getElementById('autor').value = '';
    document.getElementById('avaliacao').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('dataLeitura').value = '';
    document.getElementById('descricao').value = '';

    modal.style.display = "block";
});

btnFechar.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Função de filtro/ordenação
function aplicarFiltro(filtro) {
    let lista = [...livros];

    // filtro de categoria (valor é "ficcao","ciencia" ou "historia")
    if (filtro === 'ficcao' || filtro === 'ciencia' || filtro === 'historia') {
        lista = lista.filter(l => l.categoria === filtro);
    }
    // ordenar por avaliação (valor é "maior" ou "menor")
    else if (filtro === 'maior') {
        lista.sort((a, b) => b.avaliacao - a.avaliacao);
    }
    else if (filtro === 'menor') {
        lista.sort((a, b) => a.avaliacao - b.avaliacao);
    }
    // se filtro for "", mostra tudo

    exibirLivros(lista);
}
// Evento para aplicar filtro quando selecionar no select
document.getElementById('categoriaFiltro').addEventListener('change', e => {
    aplicarFiltro(e.target.value);
});

