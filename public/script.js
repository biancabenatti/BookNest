let livros = [];

async function carregarLivros() {
    try {
        const res = await fetch('http://localhost:3000/api/livros');
        const data = await res.json();
        livros = data;
        console.log(livros);
        exibirLivros(livros);
    } catch (err) {
        console.error('Erro ao carregar livros:', err);
    }
}

carregarLivros();

function formatDateBR(isoString) {
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

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
            <div>
                <h3>${livro.titulo}</h3>
                <p><strong>Descrição:</strong> ${livro.descricao || ''}</p>
            </div>
            <p><strong>Data de Leitura:</strong> 
                ${livro.data_leitura ? formatDateBR(livro.data_leitura) : ''}</p>
            <div class="star-rating" data-titulo="${livro.titulo}" onclick="alterarEstrelas(event, '${livro.titulo}')">
                ${[1, 2, 3, 4, 5].map(i => `
                    <i class="fa fa-star ${livro.estrelas >= i ? 'checked' : ''}" data-estrela="${i}"></i>
                `).join('')}
            </div>
            <button class="delete-btn" onclick="removerLivro('${livro._id}')">
                <i class="fa fa-trash"></i>
            </button>
        `;

        livrosLista.appendChild(livroDiv);
    });
}

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
 //// Função para alterar estrelas e atualizar no backend
 function alterarEstrelas(event, titulo) {
    const livro = livros.find(livro => livro.titulo === titulo);
    const estrela = event.target;

    if (estrela.tagName === 'I') {
        const novaClass = estrela.getAttribute('data-estrela');
        livro.estrelas = parseInt(novaClass);

        // Armazenando a alteração das estrelas no localStorage
        localStorage.setItem('livros', JSON.stringify(livros));

        exibirLivros(livros); // Recarregar livros após a alteração
    }
}

// Carregar livros do localStorage quando a página é recarregada
function carregarLivros() {
    const livrosSalvos = localStorage.getItem('livros');
    if (livrosSalvos) {
        livros = JSON.parse(livrosSalvos);
        exibirLivros(livros);
    } else {
        fetch('http://localhost:3000/api/livros')
            .then(res => res.json())
            .then(data => {
                livros = data;
                exibirLivros(livros);
            })
            .catch(err => console.error('Erro ao carregar livros:', err));
    }
}

carregarLivros();

document.getElementById('salvarLivro').addEventListener('click', async () => {
  const payload = {
    titulo: document.getElementById('titulo').value,
    autor:  document.getElementById('autor').value,
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

document.getElementById('categoriaFiltro').addEventListener('change', e => {
    const categoriaFiltro = e.target.value;
    exibirLivros(livros, categoriaFiltro);
});
