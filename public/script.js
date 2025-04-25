// Função para carregar livros
async function carregarLivros() {
    try {
        const resposta = await fetch('http://localhost:3000/api/livros');
        const livros = await resposta.json();
        exibirLivros(livros);
    } catch (erro) {
        console.error('Erro ao carregar livros:', erro);
    }
}

carregarLivros();

// Função para exibir os livros
function exibirLivros(livros = [], categoriaFiltro = '') {
    const livrosLista = document.getElementById('livrosLista');
    livrosLista.innerHTML = '';

    const livrosFiltrados = categoriaFiltro
        ? livros.filter(livro => livro.categoria === categoriaFiltro)
        : livros;

    livrosFiltrados.forEach(livro => {
        const livroDiv = document.createElement('div');
        livroDiv.classList.add('livro');

        livroDiv.innerHTML = `
            <h3>${livro.titulo}</h3>
            <p><strong>Descrição:</strong> ${livro.descricao || ''}</p>
            <p><strong>Data de Leitura:</strong> ${livro.data_leitura || ''}</p>
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

// Função para remover livro
function removerLivro(titulo) {
    const index = livros.findIndex(livro => livro.titulo === titulo);
    if (index !== -1) {
        livros.splice(index, 1);
        exibirLivros(livros);
    }
}

// Função para alterar as estrelas
function alterarEstrelas(event, titulo) {
    const livro = livros.find(livro => livro.titulo === titulo);
    const estrela = event.target;

    if (estrela.tagName === 'I') {
        const novaClass = estrela.getAttribute('data-estrela');
        livro.estrelas = parseInt(novaClass);
        exibirLivros(livros);
    }
}

// Função para salvar um novo livro
document.getElementById('salvarLivro').addEventListener('click', async () => {
  const payload = {
    titulo: document.getElementById('titulo').value,
    autor:  document.getElementById('autor').value,
    categoria: document.getElementById('categoria').value,
    avaliacao: parseFloat(document.getElementById('avaliacao').value),
    data_leitura: document.getElementById('dataLeitura').value,
    descricao: document.getElementById('descricao').value
  };

  // validação simples
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

    let result = {}
    if (res.headers.get('content-length') > 0) {
      result = await res.json();
    }

    if (res.ok) {
      alert('Livro salvo com sucesso!');
      document.getElementById('modal').style.display = 'none';
      carregarLivros();
    } else {
      alert('Erro: ' + (result.message || res.statusText));
    }
  } catch (err) {
    console.error('Fetch error:', err);
    alert('Erro ao salvar livro');
  }
});

// Modal
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

// Filtro de categoria
document.getElementById('categoriaFiltro').addEventListener('change', e => {
    carregarLivros().then(() => {
        const livros = Array.from(document.querySelectorAll('.livro'));
    });
});
