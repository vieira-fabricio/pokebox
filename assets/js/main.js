const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('carregarMais');
const urlBase = 'https://pokeapi.co/api/v2/pokemon/';

const maxRecords = 151;
const limit = 10;
let offset = 0;

function loadPokemonItens(offset, limit){
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => 
        `
            <li class= "pokemon ${pokemon.type}" onclick="getPokemonDetail(${pokemon.number});">
                <span class= "number">#${pokemon.number}</span>
                <span class= "name">${pokemon.name}</span>

                <div class= "detail">
                    <img src= "${pokemon.photo}"
                         alt= "${pokemon.name}">
                    <ol class= "types">
                        ${pokemon.types.map((type) => `<li class= "type ${type}">${type}</li>`).join('')}
                    </ol>
    
                    
                </div>
            </li>
        `
        ).join('')

        pokemonList.innerHTML += newHtml;
    })
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit

    const qtdRecordNextPage = offset + limit

    if(qtdRecordNextPage >= maxRecords){
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})


/* CARD DE HABILIDADES */

let modalContainer = document.getElementById("modal-container")
const card = document.getElementById('pokemonDetailsCard')

window.onresize = function () {
    let modalContainer = document.getElementById("modal-container");
    modalContainer.style.height = window.innerHeight + "px";
    modalContainer.style.width = window.innerWidth + "px";
}

function hideModal() {
    let modalContainer = document.getElementById("modal-container");
    modalContainer.style.display = "none";
    card.innerHTML = "";
}

let getPokemonDetail = (pokemonNumber) => {
    const urlDetails = urlBase + pokemonNumber;
    fetch(urlDetails)
    .then((response) => response.json())
    .then((detail) => {
        return generateDetailCard(detail)
    });
}

let generateDetailCard = async (pokemonDetail) => {

    const detailCard = new Details();
    detailCard.name = pokemonDetail.name;
    detailCard.number = ('000' + pokemonDetail.id).slice(-3);
    const types = pokemonDetail.types.map((typeList) => typeList.type.name);
    const [type] = types;

    detailCard.types = types;
    detailCard.type = type;

    detailCard.image = pokemonDetail.sprites.other.dream_world.front_default;

    detailCard.height = (pokemonDetail.height) / 10;
    detailCard.weight = (pokemonDetail.weight) / 10;

    detailCard.hp = pokemonDetail.stats[0].base_stat;
    detailCard.attack = pokemonDetail.stats[1].base_stat;
    detailCard.defense = pokemonDetail.stats[2].base_stat;
    detailCard.specialAttack = pokemonDetail.stats[3].base_stat;
    detailCard.specialDefense = pokemonDetail.stats[4].base_stat;
    detailCard.speed = pokemonDetail.stats[5].base_stat;


    card.innerHTML = `
    <div class="card-details ${detailCard.type}">
        <img class="detail-image" src="${detailCard.image}" alt="${detailCard.name}">
        <div class="detail-name">${detailCard.name}</div>
        <div class="detail-number">#${detailCard.number}</div>
        <div class="detail-types">
            ${detailCard.types.map((type) => `
            <div class="detail-type">
                <img alt="${type}" title="${type}" src="assets/images/type-icons/${type}.svg">
                <p>${type}</p>
            </div>
            `).join('')}
        </div>

        <div class="detail-stats-title">Base Stats</div>
        <div class="detail-weight-height">
            <span>Weight: ${detailCard.weight} kg</span>
            <span>Height: ${detailCard.height} m</span>
        </div>

        <div class="detail-stats-box">

            <div class="detail-stats">
                <p class="detail-stats-value" data-value="${detailCard.hp}">0</p>
                <p class="detail-stats-type">HP</p>
            </div>

            <div class="detail-stats">
                <p class="detail-stats-value" data-value="${detailCard.attack}">0</p>
                <p class="detail-stats-type">Attack</p>
            </div>

            <div class="detail-stats">
                <p class="detail-stats-value" data-value="${detailCard.defense}">0</p>
                <p class="detail-stats-type">Defense</p>
            </div>

            <div class="detail-stats">
                <p class="detail-stats-value" data-value="${detailCard.specialAttack}">0</p>
                <p class="detail-stats-type">Special Attack</p>
            </div>

            <div class="detail-stats">
                <p class="detail-stats-value" data-value="${detailCard.specialDefense}">0</p>
                <p class="detail-stats-type">Special Defense</p>
            </div>

            <div class="detail-stats">
                <p class="detail-stats-value" data-value="${detailCard.speed}">0</p>
                <p class="detail-stats-type">Speed</p>
            </div>
        </div>
    </div>`;

        modalContainer.style.display = "flex";

        animateCouter();
}


function animateCouter() {

    const counters = document.querySelectorAll('.detail-stats-value');
    const speed = 20000;

    counters.forEach((counter) => {
        const animate = () => {
            const value = +counter.getAttribute('data-value');
            const data = +counter.innerText;

            const time = value / speed;
            if(data < value){
                counter.innerText = Math.ceil(data + time);
                setTimeout(animate, 1);
            } else {
                counter.innerText = value;
            }
        }
        animate();
    });

}
