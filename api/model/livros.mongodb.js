use ('biblioteca')
db.livros.find()

use ('biblioteca')
db.livros.insertOne({
    titulo: "O Senhor dos Anéis",
    capa: "https://example.com/imagens/senhor_dos_aneis.jpg",
    avaliacao: 4.5,
    autor: "J.R.R. Tolkien",
  });
