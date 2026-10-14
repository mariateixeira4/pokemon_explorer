import { useCallback, useEffect, useRef, useState } from "react";
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
  const isLoadingMoreRef = useRef(false);

  const [pokemon, setPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [listError, setListError] = useState("");
  const [nextOffset, setNextOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showingList, setShowingList] = useState(true);
  const [resetSearchKey, setResetSearchKey] = useState(0);

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

  const handleLoadMore = useCallback(
    async (reset = false) => {
      if (isLoadingMoreRef.current || (!hasMore && !reset)) {
        return;
      }

      isLoadingMoreRef.current = true;
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
        isLoadingMoreRef.current = false;
        setIsLoadingMore(false);
      }
    },
    [hasMore, nextOffset],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadInitialPokemon() {
      setIsLoadingMore(true);
      setListError("");

      try {
        const result = await getPokemonList(0, 3);

        if (!isMounted) return;

        setPokemon(result.pokemon);
        setNextOffset(result.nextOffset);
        setHasMore(result.hasMore);
      } catch (error) {
        if (!isMounted) return;

        console.error(error);
        setListError("Não foi possível carregar os Pokémon. Tenta novamente.");
      } finally {
        if (isMounted) {
          setIsLoadingMore(false);
        }
      }
    }

    loadInitialPokemon();

    return () => {
      isMounted = false;
    };
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

  function handleSearch() {
    setHasSearched(true);
    setHasError(false);
    setShowingList(false);
    setListError("");
  }

  function handleError() {
    setHasError(true);
  }

  function handleGoHome() {
    setSelectedPokemon(null);
    setHasSearched(false);
    setHasError(false);
    setShowingList(true);
    setListError("");
    setPokemon([]);
    setNextOffset(0);
    setHasMore(true);
    setResetSearchKey((currentKey) => currentKey + 1);

    navigate("/");
    handleLoadMore(true);
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
      <Header onGoHome={handleGoHome} />

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
                  key={resetSearchKey}
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
                      onClick={handleGoHome}
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
