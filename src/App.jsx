import { useEffect, useState } from "react";
import Header from "./components/Header";
import SearchForm from "./components/SearchForm";
import PokemonList from "./components/PokemonList";
import PokemonDetails from "./components/PokemonDetails";
import Footer from "./components/Footer";
import { getPokemonList } from "./utils/api";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("home");
  const [pokemon, setPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [listError, setListError] = useState("");
  const [nextOffset, setNextOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showingList, setShowingList] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem("pokemon-favorites");
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("pokemon-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedPokemon(null);
      }
    }

    if (selectedPokemon) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPokemon]);

  async function handleLoadMore(reset = false) {
    if (isLoadingMore || (!hasMore && !reset)) return;

    setIsLoadingMore(true);
    setListError("");
    setShowingList(true);
    setHasSearched(false);
    setHasError(false);

    const offset = reset ? 0 : nextOffset;

    try {
      const result = await getPokemonList(offset, 12);

      setPokemon((currentPokemon) =>
        reset ? result.pokemon : [...currentPokemon, ...result.pokemon],
      );

      setNextOffset(result.nextOffset);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error(error);
      setListError("Não foi possível carregar os Pokémon. Tenta novamente.");
    } finally {
      setIsLoadingMore(false);
    }
  }

  function handleSearch() {
    setHasSearched(true);
    setHasError(false);
    setShowingList(false);
    setListError("");
  }

  function handleError() {
    setHasError(true);
  }

  function handleToggleFavorite(selectedPokemon) {
    setFavorites((currentFavorites) => {
      const isFavorite = currentFavorites.some(
        (favorite) => favorite.id === selectedPokemon.id,
      );

      if (isFavorite) {
        return currentFavorites.filter(
          (favorite) => favorite.id !== selectedPokemon.id,
        );
      }

      return [selectedPokemon, ...currentFavorites];
    });
  }

  function handleNavigate(page) {
    setActivePage(page);
    setSelectedPokemon(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="page">
      <Header activePage={activePage} onNavigate={handleNavigate} />

      <main className="main">
        {activePage === "home" ? (
          <>
            <section className="intro">
              <h2>Explore o mundo Pokémon</h2>
              <p>Pesquisa, descobre e guarda os teus Pokémon favoritos!</p>
            </section>

            <SearchForm
              setPokemon={setPokemon}
              onSearch={handleSearch}
              onError={handleError}
            />

            {!showingList && (
              <div className="pokemon-list-actions">
                <button
                  type="button"
                  className="search-form__button"
                  onClick={() => handleLoadMore(true)}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? "A carregar..." : "Ver todos os Pokémon"}
                </button>
              </div>
            )}

            {isLoadingMore && (
              <p className="search-form__loading" role="status">
                A carregar Pokémon...
              </p>
            )}

            {listError && (
              <p className="search-form__error" role="alert">
                {listError}
              </p>
            )}

            {hasSearched && pokemon.length === 0 && !hasError && (
              <p className="empty-state">Nenhum Pokémon para mostrar.</p>
            )}

            <PokemonList
              pokemon={pokemon}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onPokemonClick={setSelectedPokemon}
              title={
                showingList ? "Lista de Pokémon" : "Resultados da pesquisa"
              }
            />

            {showingList && hasMore && (
              <div className="pokemon-list-actions">
                <button
                  type="button"
                  className="search-form__button"
                  onClick={() => handleLoadMore()}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? "A carregar..." : "Mostrar mais"}
                </button>
              </div>
            )}
          </>
        ) : (
          <section className="favorites-page">
            <h2 className="favorites-section__title">Pokémon favoritos</h2>

            <p className="favorites-page__description">
              Aqui você encontra todos os seus Pokémon favoritos.
            </p>

            {favorites.length === 0 ? (
              <div className="favorites-section__empty">
                <p>Ainda não tens Pokémon favoritos.</p>
                <p>
                  Vai à página inicial, pesquisa um Pokémon e clica no coração
                  para favoritar.
                </p>
                <button
                  type="button"
                  className="search-form__button"
                  onClick={() => handleNavigate("home")}
                >
                  Explorar Pokémon
                </button>
              </div>
            ) : (
              <PokemonList
                pokemon={favorites}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onPokemonClick={setSelectedPokemon}
                title="Pokémon favoritos"
              />
            )}
          </section>
        )}
      </main>

      {selectedPokemon && (
        <PokemonDetails
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          isFavorite={favorites.some(
            (favorite) => favorite.id === selectedPokemon.id,
          )}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
