import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css'; // Importa o arquivo CSS

const API_URL = "https://apibooks.grupo-01.sd.ufersa.dev.br/GerenciarLivros"; // Substitua pela URL do seu API Gateway

function App() {
  const [livros, setLivros] = useState([]);
  const [livro, setLivro] = useState({ id: "", title: "", author: "", year: "" });
  const [modoEdicao, setModoEdicao] = useState(false);

  // Função para buscar todos os livros
  const buscarLivros = async () => {
    try {
      const response = await axios.get(API_URL);
      setLivros(response.data);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    }
  };

  // Função para buscar um livro por ID
  const buscarLivroPorId = async (id) => {
    try {
      const response = await axios.get(`${API_URL}?id=${id}`);
      setLivro(response.data);
      setModoEdicao(true);
    } catch (error) {
      console.error("Erro ao buscar livro:", error);
    }
  };

  // Função para criar ou atualizar um livro
  const salvarLivro = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicao) {
        await axios.put(API_URL, livro);
      } else {
        await axios.post(API_URL, livro);
      }
      setLivro({ id: "", title: "", author: "", year: "" });
      setModoEdicao(false);
      buscarLivros(); // Atualiza a lista de livros
    } catch (error) {
      console.error("Erro ao salvar livro:", error);
    }
  };

  // Função para deletar um livro
  const deletarLivro = async (id) => {
    try {
      await axios.delete(API_URL, { data: { id } });
      buscarLivros(); // Atualiza a lista de livros
    } catch (error) {
      console.error("Erro ao deletar livro:", error);
    }
  };

  // Carrega a lista de livros ao iniciar
  useEffect(() => {
    buscarLivros();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Gerenciamento de Livros do GABAS</h1>

      {/* Formulário para adicionar/editar livros */}
      <form onSubmit={salvarLivro} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="ID"
          value={livro.id}
          onChange={(e) => setLivro({ ...livro, id: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Título"
          value={livro.title}
          onChange={(e) => setLivro({ ...livro, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Autor"
          value={livro.author}
          onChange={(e) => setLivro({ ...livro, author: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Ano"
          value={livro.year}
          onChange={(e) => setLivro({ ...livro, year: e.target.value })}
          required
        />
        <button type="submit">{modoEdicao ? "Atualizar" : "Adicionar"}</button>
      </form>

      {/* Lista de livros */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {livros.map((livro) => (
          <li key={livro.id} style={{ marginBottom: "10px", borderBottom: "1px solid #ccc", padding: "10px 0" }}>
            <strong>{livro.title}</strong> - {livro.author} ({livro.year})
            <button onClick={() => buscarLivroPorId(livro.id)} style={{ marginLeft: "10px" }}>Editar</button>
            <button onClick={() => deletarLivro(livro.id)} style={{ marginLeft: "10px", color: "red" }}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;