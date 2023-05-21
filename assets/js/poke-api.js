const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail){
  const pokemon = new Pokemon()
  pokemon.number = pokeDetail.id
  pokemon.name = pokeDetail.name

  const types = pokeDetail.types.map((TypeSlot) => TypeSlot.type.name)
  const [type] = types

  pokemon.types = types
  pokemon.type = type

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

  return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
  .then((response) => response.json())
  .then(convertPokeApiDetailToPokemon)
}               

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const api = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`
  //buscando a lista de pokemons no servidor através do método fetch.
  return fetch(api) 
  //convertendo a lista de pokemons para json.
  .then(response => response.json())
  .then(jsonBody => jsonBody.results)
  //Através do método map vamos fazer a conversão da lista de urls das características dos pokemons para json
  .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
  .then((detailRequests) => Promise.all(detailRequests))
  .then((pokemonsDetails) => pokemonsDetails)
}