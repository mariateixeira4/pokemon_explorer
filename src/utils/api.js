const API_URL = "https://pokeapi.co/api/v2/pokemon";

export async function searchPokemon(query) {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(query.toLowerCase())}`,
  );

  if (!response.ok) {
    throw new Error("Pokémon não encontrado.");
  }

  const data = await response.json();

  return data;
}

export async function getPokemonList(offset = 0, limit = 12) {
  const response = await fetch(`${API_URL}?offset=${offset}&limit=${limit}`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar os Pokémon.");
  }

  const data = await response.json();

  const pokemonDetails = await Promise.all(
    data.results.map(async (pokemon) => {
      const pokemonResponse = await fetch(pokemon.url);

      if (!pokemonResponse.ok) {
        throw new Error("Não foi possível carregar os detalhes do Pokémon.");
      }

      return pokemonResponse.json();
    }),
  );

  return {
    pokemon: pokemonDetails,
    nextOffset: offset + data.results.length,
    hasMore: data.next !== null,
  };
}
