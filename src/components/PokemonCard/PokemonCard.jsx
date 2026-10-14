import "./PokemonCard.css";

function PokemonCard({ pokemon, isFavorite, onToggleFavorite, onClick }) {
  const image =
    pokemon.sprites?.other?.home?.front_default ||
    pokemon.sprites?.other?.["official-artwork"]?.front_default;

  const types = pokemon.types?.map((item) => item.type.name).join(", ");

  return (
    <article className="pokemon-card">
      <button
        type="button"
        className="pokemon-card__details"
        onClick={onClick}
        aria-label={`Ver detalhes de ${pokemon.name}`}
      >
        {image ? (
          <img src={image} alt={pokemon.name} className="pokemon-card__image" />
        ) : (
          <div className="pokemon-card__image pokemon-card__image--empty">
            Imagem não disponível
          </div>
        )}

        <div className="pokemon-card__content">
          <p className="pokemon-card__number">#{pokemon.id}</p>

          <h2 className="pokemon-card__name">{pokemon.name}</h2>

          <p className="pokemon-card__type">
            <strong>Tipo:</strong> {types || "Não disponível"}
          </p>

          <p className="pokemon-card__height">
            <strong>Altura:</strong> {pokemon.height / 10} m
          </p>

          <p className="pokemon-card__weight">
            <strong>Peso:</strong> {pokemon.weight / 10} kg
          </p>
        </div>
      </button>

      <button
        type="button"
        className="pokemon-card__favorite"
        onClick={() => onToggleFavorite(pokemon)}
        aria-label={
          isFavorite
            ? `Remover ${pokemon.name} dos favoritos`
            : `Adicionar ${pokemon.name} aos favoritos`
        }
        aria-pressed={isFavorite}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </article>
  );
}

export default PokemonCard;
