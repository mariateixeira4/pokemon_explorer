function PokemonCard({ pokemon, isFavorite, onToggleFavorite, onClick }) {
  const image =
    pokemon.sprites?.other?.home?.front_default ||
    pokemon.sprites?.other?.["official-artwork"]?.front_default;

  const types = pokemon.types?.map((item) => item.type.name).join(", ");

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  }

  return (
    <article
      className="pokemon-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Ver detalhes de ${pokemon.name}`}
    >
      {image ? (
        <img src={image} alt={pokemon.name} className="pokemon-card__image" />
      ) : (
        <div className="pokemon-card__image">Imagem não disponível</div>
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

        <button
          type="button"
          className="pokemon-card__favorite"
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(pokemon);
          }}
          aria-label={
            isFavorite
              ? `Remover ${pokemon.name} dos favoritos`
              : `Adicionar ${pokemon.name} aos favoritos`
          }
          aria-pressed={isFavorite}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>
    </article>
  );
}

export default PokemonCard;
