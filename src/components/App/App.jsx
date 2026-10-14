import { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import SearchForm from "../SearchForm/SearchForm";
import PokemonList from "../PokemonList/PokemonList";
import PokemonDetails from "../PokemonDetails/PokemonDetails";
import Footer from "../Footer/Footer";
import { getPokemonList } from "../../utils/api";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [pokemon, setPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [listError, setListError] = useState("");
  const [nextOffset, setNextOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showingList, setShowingList] = useState(true);

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
    handleLoadMore(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

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
      const result = await getPokemonList(offset, 3);

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

  return (
    <div className="page">
      <Header />

      <main className="main">
        <Routes>
          <Route
            path="/"
            element={
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

                {isLoadingMore && (
                  <div className="search-form__loading" role="status">
                    <span
                      className="search-form__spinner"
                      aria-hidden="true"
                    ></span>
                    <p>A carregar Pokémon...</p>
                  </div>
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
            }
          />

          <Route
            path="/favorites"
            element={
              <section className="favorites-page">
                <h2 className="favorites-section__title">Pokémon favoritos</h2>

                <p className="favorites-page__description">
                  Aqui encontras todos os teus Pokémon favoritos.
                </p>

                {favorites.length === 0 ? (
                  <div className="favorites-section__empty">
                    <p>Ainda não tens Pokémon favoritos.</p>
                    <p>
                      Vai à página inicial, pesquisa um Pokémon e clica no
                      coração para o adicionar aos favoritos.
                    </p>
                    <button
                      type="button"
                      className="search-form__button"
                      onClick={() => navigate("/")}
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
            }
          />
        </Routes>
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
