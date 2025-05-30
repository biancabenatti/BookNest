// Array para armazenar os livros
let livros = [];

// Função para carregar livros do localStorage e do backend
async function carregarLivros() {
    try {
      const res = await fetch('https://book-nest-hhh.vercel.app/api/livros');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      livros = data;
      exibirLivros(livros);
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
                <p id="descricao-${livro._id}"><strong>Descrição:</strong> ${livro.descricao || ''}</p>
                <button class="edit-btn" onclick="editarDescricao('${livro._id}')"><i class="fa fa-edit"></i> Editar descrição</button>
            </div>
            <div class="livro-info-2">
                <p><strong>Data de Leitura</strong></br>
                ${livro.data_leitura ? formatDateBR(livro.data_leitura) : ''}</p>
                <p><strong>Categoria:</strong> ${livro.categoria || ''}</p>
                <div class="star-rating" data-titulo="${livro.titulo}" onclick="alterarEstrelas(event, '${livro.titulo}')">
                    ${[1,2,3,4,5].map(i=>`
                        <i class="fa fa-star ${livro.avaliacao>=i?'checked':''}" data-estrela="${i}"></i>
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
function editarDescricao(idLivro) {
    const pDescricao = document.getElementById(`descricao-${idLivro}`);
    
    // Cria um input para editar
    const input = document.createElement('input');
    input.type = 'text';
    input.value = pDescricao.innerText.replace('Descrição:', '').trim();
    input.id = `input-descricao-${idLivro}`;
    input.style.width = '90%';
    input.style.padding = '8px';
    input.style.width = '90%';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '4px';
    input.style.fontSize = '14px';
    input.style.marginRight = '10px';
    

    // Botão de salvar
    const btnSalvar = document.createElement('button');
    btnSalvar.innerText = 'Salvar';
    btnSalvar.style.marginLeft = '10px';
    btnSalvar.classList.add('btn-salvar');
    
    btnSalvar.onclick = async function() {
        const novaDescricao = document.getElementById(`input-descricao-${idLivro}`).value;
    
        try {
            // Envia a nova descrição para o backend
            await fetch(`https://book-nest-hhh.vercel.app/api/livros/${idLivro}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ descricao: novaDescricao })
            });
    
            // Atualiza a descrição na tela
            pDescricao.innerHTML = `<strong>Descrição:</strong> ${novaDescricao}`;
            
            // Atualiza o livro no array 'livros' para refletir a mudança
            const livro = livros.find(l => l._id === idLivro);
            if (livro) {
                livro.descricao = novaDescricao;  // Atualiza a descrição no array
            }
            
            // Remove input e botão de salvar
            input.remove();
            btnSalvar.remove();
            
            alert('Descrição atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar descrição:', error);
            alert('Erro ao atualizar descrição.');
        }
    };

    // Limpa o parágrafo e coloca o input + botão
    pDescricao.innerHTML = '';
    pDescricao.appendChild(input);
    pDescricao.appendChild(btnSalvar);
}

// Função para remover livro
async function removerLivro(id) {
    const livro = livros.find(livro => livro._id === id);
    if (!livro) return;

    const confirmDelete = confirm(`Tem certeza que deseja excluir o livro: "${livro.titulo}"?`);
    if (!confirmDelete) return;

    try {
        const res = await fetch(`https://book-nest-hhh.vercel.app/api/livros/${livro._id}`,{
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
        const res = await fetch('https://book-nest-hhh.vercel.app/api/livros', {
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

