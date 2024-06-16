function renderPokemonCards(id) {
    document.getElementById('pokemonCard').innerHTML += createPokemonCardHTML(id);
    for (let i = 0; i < fetchedPokemon[id]['types'].length; i++) {
        document.getElementById(`pokemonTypes${id}`).innerHTML += /*html*/`
            <span class="badge text-bg-secondary rounded-pill text-bg-light" style="opacity: 0.5; box-shadow: #000 0px 0px 2px;">
                ${fetchedPokemon[id]['types'][i]['type']['name']} </span>`
    }
}

function getCardBackgroundColor(types) {
    const color = typeColors[`${types[0]['type']['name']}`];
    return color;
}


function generateChart(dataLabels, dataValues, chartTitle) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    pokemonChart = new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: dataLabels,
            datasets: [{ 
                label: chartTitle, 
                data: dataValues, 
                backgroundColor: 'rgba(220, 0, 0, 0.5)', 
                borderColor: 'rgba(220, 0, 0, 0.75)', 
                borderWidth: 1 
            }]
        },
        options: {
            scales: { 
                y: { 
                    suggestedMin: 0, 
                    suggestedMax: 100 
                },
                x: { 
                    ticks: {
                        autoSkip: false 
                    }
                }
            },
            title: { display: true, text: chartTitle },
            plugins: { 
                legend: { 
                    labels: { color: 'rgba(0, 0, 0, 0.75)' }, 
                    position: 'top' 
                } 
            }
        }
    });
}


function updateChart(id) {
    if (pokemonChart) {
        pokemonChart.destroy();
    }
    let labels = ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed']; 
    let values = [];
    let title = `${fetchedPokemon[id].name}'s stats`;
    for (let i = 0; i < fetchedPokemon[id].stats.length; i++) {
        const stat = fetchedPokemon[id].stats[i];
        values.push(stat.base_stat);
    }
    generateChart(labels, values, title);
}


async function loadPokemonNames() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=8000&offset=0`;
    let pokemonNamesFetch = await fetch(url);
    let pokemonNamesJson = await pokemonNamesFetch.json();
    pokemonNames = pokemonNamesJson['results'];
}

async function fetchPokemonData() {
    showLoadingScreen();

    let newPokemonData = [];
    const offset = fetchAmountLoaded;
    for (let i = offset; i < Math.min(fetchAmount, (pokemonNames.length - fetchAmountLoaded)); i++) {
        const id = i;
        if (!fetchedPokemon[id] && !document.getElementById(`pokemonCard${id + 1}`)) {
            newPokemonData.push(fetchPokemon(id))
        }
    }

    await Promise.all(newPokemonData);

    for (const [_, value] of Object.entries(fetchedPokemon)) {
        if (!document.getElementById(`pokemonCard` + value.id)) {
            renderPokemonCards(value.id - 1);
        }
      }

    hideLoadingScreen();

    fetchAmountLoaded += 20; 
}