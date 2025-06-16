let livros = [];

const messageModal = document.createElement('div');
messageModal.id = 'messageModal';
messageModal.classList.add('custom-modal');
messageModal.innerHTML = `
    <div class="custom-modal-content">
        <span class="custom-close-button">&times;</span>
        <h2 id="messageModalTitle"></h2>
        <p id="messageModalText"></p>
        <button class="custom-modal-ok-button">OK</button>
    </div>
`;
document.body.appendChild(messageModal);

const messageModalTitle = document.getElementById('messageModalTitle');
const messageModalText = document.getElementById('messageModalText');
const messageModalCloseButton = messageModal.querySelector('.custom-close-button');
const messageModalOkButton = messageModal.querySelector('.custom-modal-ok-button');

function showMessage(title, message) {
    messageModalTitle.innerText = title;
    messageModalText.innerText = message;
    messageModal.classList.add('is-visible');
    return new Promise(resolve => {
        messageModalOkButton.onclick = () => {
            messageModal.classList.remove('is-visible');
            resolve();
        };
        messageModalCloseButton.onclick = () => {
            messageModal.classList.remove('is-visible');
            resolve();
        };
    });
}

const confirmModal = document.createElement('div');
confirmModal.id = 'confirmModal';
confirmModal.classList.add('custom-modal');
confirmModal.innerHTML = `
    <div class="custom-modal-content">
        <span class="custom-close-button">&times;</span>
        <h2 id="confirmModalTitle">Confirmação</h2>
        <p id="confirmModalText"></p>
        <div class="custom-modal-buttons">
            <button class="custom-modal-cancel-button">Cancelar</button>
            <button class="custom-modal-confirm-button">Confirmar</button>
        </div>
    </div>
`;
document.body.appendChild(confirmModal);

const confirmModalText = document.getElementById('confirmModalText');
const confirmModalCloseButton = confirmModal.querySelector('.custom-close-button');
const confirmModalCancelButton = confirmModal.querySelector('.custom-modal-cancel-button');
const confirmModalConfirmButton = confirmModal.querySelector('.custom-modal-confirm-button');

function showConfirmation(message) {
    confirmModalText.innerText = message;
    confirmModal.classList.add('is-visible');
    return new Promise(resolve => {
        confirmModalConfirmButton.onclick = () => {
            confirmModal.classList.remove('is-visible');
            resolve(true);
        };
        confirmModalCancelButton.onclick = () => {
            confirmModal.classList.remove('is-visible');
            resolve(false);
        };
        confirmModalCloseButton.onclick = () => {
            confirmModal.classList.remove('is-visible');
            resolve(false);
        };
    });
}

async function carregarLivros() {
    try {
        const token = localStorage.getItem('token');

        const res = await fetch('https://booknest-s381.onrender.com/api/livros', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `HTTP ${res.status}`);
        }
        const data = await res.json();
        livros = data;
        exibirLivros(livros);
    } catch (err) {
        console.error('Erro ao carregar livros:', err);
        showMessage('Erro', 'Não foi possível carregar os livros: ' + err.message);
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
                <p><strong>Leitura: </strong></br>
                ${livro.data_leitura ? formatDateBR(livro.data_leitura) : ''}</p>
                <p><strong>Categoria:</strong> ${livro.categoria || ''}</p>
                <div class="star-rating" data-titulo="${livro.titulo}" onclick="alterarEstrelas(event, '${livro.titulo}')">
                    ${[1, 2, 3, 4, 5].map(i => `
                        <i class="fa fa-star ${livro.avaliacao >= i ? 'checked' : ''}" data-estrela="${i}"></i>
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

    const input = document.createElement('input');
    input.type = 'text';
    input.value = pDescricao.innerText.replace('Descrição:', '').trim();
    input.id = `input-descricao-${idLivro}`;
    input.style.width = '90%';
    input.style.padding = '8px';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '4px';
    input.style.fontSize = '14px';
    input.style.marginRight = '10px';

    const btnSalvar = document.createElement('button');
    btnSalvar.innerText = 'Salvar';
    btnSalvar.style.marginLeft = '10px';
    btnSalvar.classList.add('btn-salvar');

    btnSalvar.onclick = async function() {
        const novaDescricao = document.getElementById(`input-descricao-${idLivro}`).value;

        if (novaDescricao.length < 10) {
            showMessage('Erro de Validação', 'A descrição deve ter pelo menos 10 caracteres.');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const res = await fetch(`https://booknest-s381.onrender.com/api/livros/${idLivro}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    descricao: novaDescricao
                })
            });

            if (res.ok) {
                pDescricao.innerHTML = `<strong>Descrição:</strong> ${novaDescricao}`;

                const livro = livros.find(l => l._id === idLivro);
                if (livro) {
                    livro.descricao = novaDescricao;
                }

                input.remove();
                btnSalvar.remove();

                showMessage('Sucesso!', 'Descrição atualizada com sucesso!');
            } else {
                const errorData = await res.json();
                let errorMessage = 'Erro ao atualizar descrição.';
                if (errorData.errors && errorData.errors.length > 0) {
                    errorMessage = errorData.errors.map(err => err.msg).join('\n');
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                }
                showMessage('Erro de Validação', errorMessage);
            }
        } catch (error) {
            console.error('Erro ao atualizar descrição:', error);
            showMessage('Erro', 'Erro ao conectar com o servidor para atualizar descrição.');
        }
    };

    pDescricao.innerHTML = '';
    pDescricao.appendChild(input);
    pDescricao.appendChild(btnSalvar);
}

async function removerLivro(id) {
    const livro = livros.find(livro => livro._id === id);
    if (!livro) return;

    const confirmDelete = await showConfirmation(`Tem certeza que deseja excluir o livro: "${livro.titulo}"?`);
    if (!confirmDelete) return;

    try {
        const token = localStorage.getItem('token');

        const res = await fetch(`https://booknest-s381.onrender.com/api/livros/${livro._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.ok) {
            livros = livros.filter(l => l._id !== livro._id);
            exibirLivros(livros);
            showMessage('Sucesso!', 'Livro excluído com sucesso!');
        } else {
            const err = await res.json();
            showMessage('Erro', 'Erro ao excluir: ' + (err.message || res.statusText));
        }
    } catch (err) {
        console.error('Erro ao excluir livro:', err);
        showMessage('Erro', 'Erro ao conectar com o servidor.');
    }
}

document.getElementById('salvarLivro').addEventListener('click', async () => {
    const payload = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        categoria: document.getElementById('categoria').value,
        avaliacao: parseFloat(document.getElementById('avaliacao').value),
        data_leitura: document.getElementById('dataLeitura').value,
        descricao: document.getElementById('descricao').value
    };

    try {
        const token = localStorage.getItem('token');

        const res = await fetch('https://booknest-s381.onrender.com/api/livros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        let result = {};
        const contentLength = res.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > 0) {
            result = await res.json();
        }

        if (res.ok) {
            showMessage('Sucesso!', 'Livro salvo com sucesso!');
            document.getElementById('modal').classList.remove('is-visible');

            if (result && result._id) {
                livros.push(result);
                exibirLivros(livros);
            } else {
                carregarLivros();
            }

        } else {
            let errorMessage = 'Erro ao salvar livro.';
            if (result.errors && result.errors.length > 0) {
                errorMessage = result.errors.map(err => err.msg).join('\n');
            } else if (result.message) {
                errorMessage = result.message;
            }
            showMessage('Erro de Validação', errorMessage);
        }
    } catch (err) {
        console.error('Fetch error:', err);
        showMessage('Erro', 'Erro ao conectar com o servidor para salvar livro.');
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

    modal.classList.add("is-visible");
});

btnFechar.addEventListener("click", () => {
    modal.classList.remove("is-visible");
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.remove("is-visible");
    }
});

function aplicarFiltro(filtro) {
    let lista = [...livros];

    if (filtro === 'ficcao' || filtro === 'ciencia' || filtro === 'historia') {
        lista = lista.filter(l => l.categoria === filtro);
    } else if (filtro === 'maior') {
        lista.sort((a, b) => b.avaliacao - a.avaliacao);
    } else if (filtro === 'menor') {
        lista.sort((a, b) => a.avaliacao - b.avaliacao);
    }

    exibirLivros(lista);
}

document.getElementById('categoriaFiltro').addEventListener('change', e => {
    aplicarFiltro(e.target.value);
});
