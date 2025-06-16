import './css/styles.css'

document.getElementById('form-livro').addEventListener('submit', async (event) => {
  event.preventDefault()

  const form = event.target
  const data = {
    titulo: form.titulo.value,
    avaliacao: parseFloat(form.avaliacao.value),
    autor: form.autor.value,
    data_leitura: form.dataLeitura.value,
    descricao: form.descricao.value
  }

  const token = localStorage.getItem('token') 
  console.log('Token no envio do livro:', token);

  try {
    const response = await fetch('https://booknest-s381.onrender.com/api/livros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`    
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()
    if (response.ok) {
      document.getElementById('resultado').innerText = 'Livro salvo com sucesso!'
    } else {
      document.getElementById('resultado').innerText = `Erro: ${result.message}`
    }
  } catch (err) {
    document.getElementById('resultado').innerText = 'Erro ao enviar dados!'
    console.error(err)
  }
})