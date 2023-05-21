//poke-api
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

 

//main.js
const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('carregarMais');

const limit = 10
let offset = 0;
const maxRecords = 150

function loadPokemonItens(offset, limit){
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
  const newHtml = pokemons.map((pokemon) => 
  `
      <li class= "pokemon${pokemon.type}">
        <span class= "number">#${pokemon.number}</span>
        <span class= "name">${pokemon.name}</span>

        <div class= "detail">
          <ol class= "types">
            ${pokemon.types.map((type) => `<li class= "${type}">${type}</li>`).join('')}
          </ol>

          <img src= "${pokemon.photo}"
          alt= "${pokemon.name}"
        </div>           
      </li>
  `
  ).join('')

  pokemonList.innerHTML += newHtml 

  }) 

}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener("click", () => {
  offset += limit

  const qtdRecordNextPage = offset + limit

  if(qtdRecordNextPage >= maxRecords){
    const newLimit = maxRecords - offset
    loadPokemonItens(offset, newLimit)

    loadMoreButton.parentElement.removeChild(loadMoreButton)
  }else{
    loadPokemonItens(offset, limit)
  }
})



//Pokemon-model

class Pokemon{
  number;
  name;
  type;
  types = [];
  photo;
}


