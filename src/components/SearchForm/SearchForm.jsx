import { useState } from "react";
import { searchPokemon } from "../../utils/api";
import "./SearchForm.css";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function SearchForm({ setPokemon, onSearch, onError }) {
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (isLoading) return;

    if (!query.trim()) {
      setErrorMessage("Digite o nome ou número de um Pokémon.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);
    onSearch();

    try {
      const [result] = await Promise.all([
        searchPokemon(query.trim()),
        delay(500),
      ]);

      setPokemon([result]);
    } catch (error) {
      console.error(error);
      setPokemon([]);
      setErrorMessage("Pokémon não encontrado. Tente outro nome ou número.");
      onError();
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(event) {
    setQuery(event.target.value);
    setErrorMessage("");
  }

  return (
    <>
      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="pokemon-search">Nome ou número do Pokémon</label>

        <input
          id="pokemon-search"
          type="text"
          className="search-form__input"
          placeholder="Ex.: pikachu ou 25"
          value={query}
          onChange={handleChange}
          disabled={isLoading}
        />

        <button
          type="submit"
          className="search-form__button"
          disabled={isLoading}
        >
          {isLoading ? "Pesquisando..." : "Pesquisar"}
        </button>
      </form>

      {isLoading && (
        <div className="search-form__loading" role="status">
          <span className="search-form__spinner" aria-hidden="true"></span>
          <p>Carregando Pokémon...</p>
        </div>
      )}

      {errorMessage && (
        <p className="search-form__error" role="alert">
          {errorMessage}
        </p>
      )}
    </>
  );
}

export default SearchForm;
