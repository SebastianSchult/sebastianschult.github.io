function createPokemonCardHTML(id) {
    const pokemon = fetchedPokemon[id];
    if (!pokemon) {
        return ''; 
    }

    const types = pokemon.types.map(type => type.type.name.toUpperCase()).join(' ');
    const cardHTML = `
    <div class="card d-flex justify-content-between flex-column p-2 m-1 rounded-4 cardSmall" role="button" style="width: 240px; height: 240px; background: ${getCardBackgroundColor(fetchedPokemon[id]['types'])}"
            id="pokemonCard${id + 1}" onclick="showDetails(${id})" onmouseover="showAnimation(${id})" onmouseout="showOriginalImg(${id})">
            <div class="d-flex justify-content-between">
                <h6 class="card-title m-0" style="text-transform: capitalize; color: white; text-shadow: #000 0px 0px 4px;">${pokemon['name']}</h6>
                <h6 class="m-0" style="color: black; font-weight: bold;"><b># ${pokemon['id']}</b></h6>
            </div>
            <img src="${getImg(id)}" id="pokemonImg${id}" class="position-absolute top-50 start-50 translate-middle m-0" alt="Pokemon Image" style="height: 100px; width: 100px; object-fit: contain;">
            <p id="pokemonTypes${id}" style="text-transform: capitalize;" class="d-flex justify-content-between m-0"></p>
    `;
    return cardHTML;
}


function generatePokemonDetailHTML(id, previousPokemonId, nextPokemonId) {
    const pokemon = fetchedPokemon[id];
    const types = pokemon.types.map(type => type.type.name.toUpperCase()).join(' ');
    const chartHTML = '<canvas id="radarChart" class="m-2"></canvas>'; 

    return /*html*/ `
    <div class="pokemonDetailCard position-absolute top-50 start-50 translate-middle p-3 rounded-5 m-0" style="width: 300px; height: 500px; background: ${getCardBackgroundColor(pokemon.types)}"
            id="pokemonDetailCard">
            <div class="d-flex justify-content-between">
                <h3 class="card-title m-0" style="padding: 8px; text-transform: capitalize; color: white; text-shadow: #000 0px 0px 4px;">${pokemon.name}</h3>
                <h5 class="m-0" style="color: black; text-shadow: #fff 0px 0px 4px;"><b>#${pokemon.id}</b></h5>
            </div>
            <div class="d-flex justify-content-center align-items-center position-absolute bottom-50 start-50 translate-middle-x" style="width: 288px">
                <button type="button" onclick="showDetails(${previousPokemonId})" class="btn btn-danger"><</button>
                <img src="${getImg(id)}" class="card-img-top img-fluid" alt="Pokémon sprite" style="height: 196px; width: 256; object-fit: contain;" id="pokemonSprite${id}">
                <button type="button" onclick="showDetails(${nextPokemonId})" class="btn btn-danger">></button>
            </div>
            <button type="button" class="btn btn-danger position-absolute bottom-100 end-0" onclick="closeDetails()">x</button>
            
            <div style="background-color: rgba(191, 191, 191,0.9); width: 298px; border-top: 1px solid black" class="rounded-bottom-5 position-absolute bottom-0 start-50 translate-middle-x">
            <div id="pokemonTypes" class="badge rounded-pill text-bg-light" style="background: ${getCardBackgroundColor(pokemon.types)}; justify-content: center; align-items: center; opacity: 0.5; box-shadow: #000 0px 0px 2px; display: space-between;">${types}</div>
                ${chartHTML}
            </div>
        </div>
    `;
}