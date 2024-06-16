let pokemonNames = {};
let fetchAmount = 40;
let fetchAmountLoaded = 0;
let fetchedPokemon = {};
let currentPokemonData = null; 


async function init() {
    await loadPokemonNames();
    update();
}


async function update() {
    await fetchPokemonData();
}


async function fetchPokemon(id) {
    const name = pokemonNames[id].name;
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    const pokemon = await fetch(url);
    fetchedPokemon[id] = await pokemon.json();
}


function getImg(id) {
    let img = fetchedPokemon[id]['sprites']['other']['official-artwork']['front_default'];
    return img;
}


function showAnimation(id) {
    if (fetchedPokemon[id]['sprites']['other']['showdown']['front_default']) {
        document.getElementById(`pokemonImg${id}`).src = `${fetchedPokemon[id]['sprites']['other']['showdown']['front_default']}`;
    }
    else {
        if (fetchedPokemon[id]['sprites']['other']['front_default']) {
            document.getElementById(`pokemonImg${id}`).src = `${fetchedPokemon[id]['sprites']['front_default']}`;
        };
    };
}


function getCardBackgroundColor(types) {
    const color = typeColors[`${types[0]['type']['name']}`];
    return color;
}


function showOriginalImg(id) {
    const imgSrc = getImg(id);
    if (imgSrc) {
        document.getElementById(`pokemonImg${id}`).src = imgSrc;
    }
}


async function showDetails(id) {
    document.getElementById('loadingScreen').classList.remove('d-none');
    const previousId = await previousPokemon(id);
    const nextId = await nextPokemon(id);
    generatePokemonDetail(id, previousId, nextId);
    document.getElementById('loadingScreen').classList.add('d-none');
}


function getLastFetchedPokemonIndex() {
    let lastIndex = -1;
    for (const key in fetchedPokemon) {
        if (fetchedPokemon.hasOwnProperty(key)) {
            lastIndex = parseInt(key); 
        }
    }
    return lastIndex;
}


async function previousPokemon(currentId) {
    let previousId = currentId - 1;
    if (previousId < 0) {
        previousId = pokemonNames.length - 1;
    }

    if (!(previousId in fetchedPokemon)) {
        await fetchPokemon(previousId);
    }

    return previousId;
}


async function nextPokemon(id) {
    const currentIndex = id;
    let nextPokemonId;

    if (currentIndex === pokemonNames.length - 1) {
        nextPokemonId = 0;
    } else {
        nextPokemonId = currentIndex + 1;
    }

    if (!(nextPokemonId in fetchedPokemon)) {
        await fetchPokemon(nextPokemonId);
    }

    return nextPokemonId;
}


async function generatePokemonDetail(id, previousId, nextId) {
    document.getElementById('pokemonDetail').classList.remove('d-none');
    document.getElementById('pokemonDetailCard').innerHTML = generatePokemonDetailHTML(id, previousId, nextId);
    await showChart(id); 
    document.getElementById('loadingScreen').classList.add('d-none');
}


async function showChart(id) {
    let labels = ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'];
    let values = [];
    let title = `${fetchedPokemon[id].name}'s stats`;
    for (let i = 0; i < fetchedPokemon[id].stats.length; i++) {
        const stat = fetchedPokemon[id].stats[i];
        values.push(stat.base_stat);
    }
    generateChart(labels, values, title);
}


function closeDetails() {
    document.getElementById('pokemonDetail').classList.add('d-none');
    document.getElementById('pokemonDetailCard').innerHTML = '';  
}


function load20More() {
    fetchAmount += 20; 
    fetchPokemonData(); 
}


let searchInput = ''; 

function searchPokemons() {
    searchInput = document.getElementById('searchInput').value.trim();
    const search = searchInput.toLowerCase();

    if (searchInput.length < 3) {
        renderAllPokemonData();
        return;
    }

    if (searchInput.length >= 3) {
        renderSearchResults(search);
    }
}


function renderAllPokemonData() {
    let pokemonContainer = document.getElementById('pokemonCard');
    pokemonContainer.innerHTML = '';

    for (let id in fetchedPokemon) {
        const cardHTML = createPokemonCardHTML(id);
        if (cardHTML) {
            pokemonContainer.insertAdjacentHTML('beforeend', cardHTML);
        }
    }
}


function renderSearchResults(search) {
    let pokemonContainer = document.getElementById('pokemonCard');
    pokemonContainer.innerHTML = '';

    for (let index = 0; index < pokemonNames.length; index++) {
        let pokemon = pokemonNames[index];
        if (pokemon.name.toLowerCase().startsWith(search)) {
            const id = index; 
            const cardHTML = createPokemonCardHTML(id);
            if (cardHTML) {
                pokemonContainer.insertAdjacentHTML('beforeend', cardHTML);
            }
        }
    }
}


function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.remove('d-none');
    } else {
        console.error("Element with id 'loadingScreen' not found.");
    }
}


function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('d-none');
    } else {
        console.error("Element with id 'loadingScreen' not found.");
    }
}


function doNotClose(event) {
    event.stopPropagation();
}