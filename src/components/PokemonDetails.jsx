import "./PokemonDetails.css";

function PokemonDetails({ pokemon, onClose, isFavorite, onToggleFavorite }) {
  if (!pokemon) return null;

  const image =
    pokemon.sprites?.other?.home?.front_default ||
    pokemon.sprites?.other?.["official-artwork"]?.front_default;

  const types = pokemon.types?.map((item) => item.type.name).join(" / ");

  const stats = pokemon.stats || [];

  const statNames = {
    hp: "HP",
    attack: "Ataque",
    defense: "Defesa",
    "special-attack": "Ataque especial",
    "special-defense": "Defesa especial",
    speed: "Velocidade",
  };

  return (
    <div className="pokemon-details__overlay" onClick={onClose}>
      <section
        className="pokemon-details"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pokemon-details__name"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="pokemon-details__close"
          onClick={onClose}
          aria-label="Fechar detalhes"
        >
          ×
        </button>

        <p className="pokemon-details__number">#{pokemon.id}</p>

        {image ? (
          <img
            className="pokemon-details__image"
            src={image}
            alt={pokemon.name}
          />
        ) : (
          <p>Imagem não disponível</p>
        )}

        <h2 className="pokemon-details__name" id="pokemon-details__name">
          {pokemon.name}
        </h2>

        <p className="pokemon-details__type">
          <strong>Tipo:</strong> {types || "Não disponível"}
        </p>

        <div className="pokemon-details__measurements">
          <p>
            <strong>Altura</strong>
            <span>{pokemon.height / 10} m</span>
          </p>
          <p>
            <strong>Peso</strong>
            <span>{pokemon.weight / 10} kg</span>
          </p>
        </div>

        <h3 className="pokemon-details__subtitle">Estatísticas</h3>

        <div className="pokemon-details__stats">
          {stats.map((stat) => {
            const name = statNames[stat.stat.name] || stat.stat.name;
            const value = stat.base_stat;
            const percentage = Math.min((value / 150) * 100, 100);

            return (
              <div className="pokemon-details__stat" key={stat.stat.name}>
                <div className="pokemon-details__stat-label">
                  <span>{name}</span>
                  <strong>{value}</strong>
                </div>
                <div className="pokemon-details__stat-track">
                  <div
                    className="pokemon-details__stat-bar"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <h3 className="pokemon-details__subtitle">Habilidades</h3>
        <p className="pokemon-details__abilities">
          {pokemon.abilities
            ?.map((item) => item.ability.name.replace("-", " "))
            .join(", ") || "Não disponível"}
        </p>

        <button
          type="button"
          className="pokemon-details__favorite"
          onClick={() => onToggleFavorite(pokemon)}
        >
          {isFavorite
            ? "❤️ Remover dos favoritos"
            : "🤍 Adicionar aos favoritos"}
        </button>
      </section>
    </div>
  );
}

export default PokemonDetails;
