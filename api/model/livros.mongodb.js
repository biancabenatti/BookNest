use ('biblioteca')
db.livros.find()

use('biblioteca')
db.livros.insertOne({
  titulo: "O Senhor dos Anéis",
  avaliacao: 4,
  autor: "J.R.R. Tolkien",
  data_leitura: new Date("2025-04-25"),
  descricao: "Uma épica história de fantasia que narra a jornada para destruir o Um Anel.",
  categoria: "Fantasia"
})

