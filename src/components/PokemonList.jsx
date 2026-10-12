import PokemonCard from "./PokemonCard";

function PokemonList({
  pokemon,
  favorites,
  onToggleFavorite,
  onPokemonClick,
  title,
}) {
  return (
    <section className="pokemon-list" aria-label={title}>
      {pokemon.map((item) => {
        const isFavorite = favorites.some(
          (favorite) => favorite.id === item.id,
        );

        return (
          <PokemonCard
            key={item.id}
            pokemon={item}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            onClick={() => onPokemonClick(item)}
          />
        );
      })}
    </section>
  );
}

export default PokemonList;
