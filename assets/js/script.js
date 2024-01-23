$(document).ready(() => {
    const battleButton = document.getElementById('battle');
    battleButton.addEventListener('click', () =>{
        initBattle();
    });
});


// ----------------------------------------------------------------
//  GET POKEMON INFORMATION OR MOVE INFORMATION BY ID
// ----------------------------------------------------------------
function getPokemonInfo(feature, id) {
    const APIURL = `https://pokeapi.co/api/v2/${feature}/${id}/`;
    let pokemonData;
    $.ajax({
        type: 'GET',
        url: APIURL,
        async: false,
        success: function (response) {
            pokemonData = response;
        },
        timeout: 20000,
        error: function () {
            alert('Error: Pokemon data not found');
        },
    });
    return pokemonData;
}


// ----------------------------------------------------------------
//  GETS FOUR RANDOM AND UNIQUE MOVES BY RANDOM IDS
// ----------------------------------------------------------------
function getFourRandomMoves(){
    let movesArray = [];
    for (let index = 0; index < 4; index++) {
        let newMove = getPokemonInfo('move', Math.floor(Math.random() * 100) + 1);
        while (movesArray.some(move => move && move.name ===newMove.name)) {
            newMove = getPokemonInfo('move', Math.floor(Math.random() * 100) + 1);
        }
        movesArray.push(newMove);
    }
    return movesArray
}


// ----------------------------------------------------------------
//  CREATES ONE POKEMON
// ----------------------------------------------------------------
function createPokemon(action, currentPokemon){
    let currentPokemonName = document.createElement('span')
    currentPokemonName.innerHTML = currentPokemon.name+'  L'+(Math.floor(Math.random() * 99)+1);
    $('#battleField')[0].append(currentPokemonName)

    
    let currentPokemonHp = document.createElement('div')
    currentPokemonHp.className = 'pokemonHp'
    currentPokemonHp.innerHTML = `<span>100%</span>`
    $('#battleField')[0].append(currentPokemonHp)
    
    let currentPokemonImg = document.createElement('img')

    switch(action){
        case 'front':
            currentPokemonImg.src = currentPokemon.sprites.front_default
            break;
        case 'back':    
            currentPokemonImg.src = currentPokemon.sprites.back_default
            break;
    }
    $('#battleField')[0].append(currentPokemonImg)

    let pokemonTypes = [];
    currentPokemon.types.forEach((currentType) => {
        pokemonTypes.push(currentType.type.name)
    })
    pokemonTypes = pokemonTypes.join(' / ')

    currentPokemonImg.addEventListener('click', () => {
        alert(currentPokemon.name.charAt(0).toUpperCase()+currentPokemon.name.slice(1) + "\n"
            + pokemonTypes + "\n"
            + "--------------------------------- \n"
            + "HP: 100% \n"
            + "Ability: " + currentPokemon.abilities[0].ability.name)
    })
}


// ----------------------------------------------------------------
//  SHOWS THE COMPLETE GAME
// ----------------------------------------------------------------
function createShowdown(main, firstPokemon, secondPokemon){
    let actualMoves = getFourRandomMoves();

    main.innerHTML = 
        `<div id='pokemonBattleContainer'>
            <div id='battleField'></div>

            <button id='rematch'>ReMatch</button>

            <div id='attacks'></div>
        </div>`

    createPokemon('front', firstPokemon)
    createPokemon('back', secondPokemon)

    actualMoves.forEach((move) => {
        let divAttack = document.createElement('div')
        divAttack.innerHTML = 
            `<h3>${move.name}</h3>
            <div>
                <span>${move.type.name}</span>
                <span>${move.pp}/${move.pp}</span>
            </div>`
            
        divAttack.addEventListener('click', () => {
            alert(move.name.charAt(0).toUpperCase(0)+ move.name.slice(1) + "\n"
                + move.type.name.charAt(0).toUpperCase(0)+ move.type.name.slice(1) + ' --> ' + move.damage_class.name + "\n"
                + "--------------------------------- \n"
                + "Base Power: " + move.power + "\n"
                + "Accuracy: " + move.accuracy + "\n"
                + "--------------------------------- \n"
                + move.flavor_text_entries[0].flavor_text)
        })

        $('#attacks')[0].appendChild(divAttack);
    })
    
    if(main.innerHTML !== ''){
        const rematchButton = $('#rematch')[0];
        rematchButton.addEventListener('click', () => {
            initBattle();
        })
    }
}


// ----------------------------------------------------------------
//  INITIALIZES THE TWO POKEMONS
// ----------------------------------------------------------------
function initBattle() {
    const main = document.getElementsByTagName('main')[0];
    main.innerHTML = '';

    let firstPokemon = getPokemonInfo('pokemon', Math.floor(Math.random() * 500) + 1);
    let secondPokemon = getPokemonInfo('pokemon', Math.floor(Math.random() * 500) + 1);

    createShowdown(main, firstPokemon, secondPokemon);
}