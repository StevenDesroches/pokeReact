import { useState, useEffect } from 'react'
import * as pokeApi from '@/lib/pokeApi/pokemon'



export default function PokeTest() {
    const [pokemonId, setPokemonId] = useState(0)
    const [pokemons, setPokemons] = useState<pokeApi.Pokemon[]>([]);
    const [displayedPokemonIds, setDisplayedPokemonIds] = useState([]);
    const [pokemon, setPokemon] = useState<pokeApi.Pokemon>(null);


    useEffect(() => {




        async function loadPage(pageNumber: number = 0) {
            let limit = 20;
            let offset = pageNumber * limit;
            pokeApi.getPokemons(limit, offset).then((pokemonList) => {
                // console.log(pokemonList);

                // setPokemons(prev => [...prev, ...pokemonList.pokemons]);
                setPokemons(prev => {
                    // Avoid adding duplicates if this effect ran twice
                    //dev only, strict mode run this twice
                    const existingIds = new Set(prev.map(p => p.id));
                    const newOnes = pokemonList.pokemons.filter(p => !existingIds.has(p.id));
                    return [...prev, ...newOnes];
                });

                if (pageNumber == 0) {
                    setDisplayedPokemonIds(pokemonList.pokemons.map((pokemon) => pokemon.id));
                }

                let allPokemonsHaveBeenLoaded = pokemonList.count <= pokemonList.page * limit;
                if (!allPokemonsHaveBeenLoaded) {
                    loadPage(pageNumber + 1);
                }
            });
        }
        loadPage();
        // return () => {};
    }, [])


    useEffect(() => {
        // console.log(`pokemonId: ${pokemonId}`);

        if (pokemonId) {
            pokeApi.getPokemon(pokemonId).then((pokemon) => {
                setPokemon(pokemon);
                console.log(pokemon)
                console.log(pokemon.name);
            })
        }

    }, [pokemonId]);

    return <div>
        {/* test test
        <input type='number' onChange={(e) => setId(parseInt(e.target.value))}></input>
        id: {id} */}

        <SearchBar pokemons={pokemons} setDisplayedPokemonIds={setDisplayedPokemonIds} />
        <PokemonList pokemons={pokemons} displayedPokemonIds={displayedPokemonIds} setPokemonId={setPokemonId} />
        <Pokemon pokemon={pokemon} />


        <RandomPokemonGame pokemons={pokemons} />

    </div>;
}

export function RandomPokemonGame({ pokemons }) {
    const [randomPokemon, setRandomPokemon] = useState<pokeApi.Pokemon>();
    const [pokemonInput, setPokemonInput] = useState<String>();
    const [gameWon, setGameWon] = useState<boolean>(false);

    // console.log('initialRandomPokemon',initialRandomPokemon);
    // console.log('randomPokemon',randomPokemon);

    function isPokemonValid() {
        if (pokemonInput.toLocaleLowerCase() === randomPokemon.name.toLocaleLowerCase()) {
            setGameWon(true);
        } else {
            alert('wrong pokemon');
        }
    }

    function startGame() {
        if (pokemons.length <= 0) return;
        const randomIndex = Math.floor(Math.random() * pokemons.length);
        setRandomPokemon(pokemons[randomIndex]);
        setGameWon(false);
        console.log('pokemons[randomIndex]',pokemons[randomIndex]);
    }

    let imgStyle = {
        filter: "brightness(0%)"
    }

    if (gameWon)
        return <div>
            <div>
                <img src={randomPokemon.sprites.front_default} />
            </div>
            <div>
                You Won!
            </div>
            <button type="button" onClick={startGame}>
                New game
            </button>
        </div>

    if (randomPokemon)
        return <div>
            <div>
                <img style={imgStyle} src={randomPokemon.sprites.front_default} />
            </div>
            <input onChange={(e) => setPokemonInput(e.target.value)}></input>
            <button type="button" onClick={isPokemonValid}>Go</button>
            {/* <RandomPokemonGameNewGame pokemons={pokemons} setRandomPokemon={setRandomPokemon} /> */}
            <button type="button" onClick={startGame}>
                New game
            </button>
        </div>
    return <div>
        <button type="button" onClick={startGame}>
            Start game
        </button>
    </div>
}


// export function RandomPokemonGameInput({ randomPokemon }) {




//     return <div>

//         {/* <select>
//             {
//                 pokemons.map(pokemon => {
//                     return <option key={pokemon.id.toString()}>{pokemon.name}</option>
//                 })
//             }
//         </select> */}
//     </div>
// }
// export function RandomPokemonGameNewGame({ pokemons, setRandomPokemon }) {
//     return <div></div>
// }

export function SearchBar({ pokemons, setDisplayedPokemonIds }) {
    const [query, setQuery] = useState("");

    useEffect(() => {
        let pokemonsFound = pokemons.filter((pokemon) => {
            if (pokemon.name.includes(query))
                return pokemon
        })
        if (query) {
            let displayedIds = pokemonsFound.map((pokemon) => pokemon.id).splice(0, 20);
            setDisplayedPokemonIds(displayedIds);
        } else {
            let displayedIds = pokemons.map((pokemon) => pokemon.id).splice(0, 20);
            setDisplayedPokemonIds(displayedIds);
        }
        // }, [query, setDisplayedPokemonIds])
    }, [pokemons, query, setDisplayedPokemonIds])

    return (
        <div>
            <input type="text" value={query} placeholder="Search" onChange={(e) => setQuery(e.target.value)}>
            </input>
        </div>
    )
}

export function PokemonList({ pokemons, displayedPokemonIds, setPokemonId }) {
    // const [pokemonList, setPokemonList] = useState<pokeApi.PokemonList>(null);

    // useEffect(() => {
    //     pokeApi.getPokemons(20).then((pokemonList) => {
    //         setPokemonList(pokemonList);
    //         console.log(pokemonList);
    //     })
    // }, [])

    // console.log('displayedPokemonIds',displayedPokemonIds);

    // let pokemons = pokemonList?.pokemons;
    if (!pokemons)
        return <></>
    return <div>
        {
            pokemons.map(pokemon => {
                if (displayedPokemonIds.includes(pokemon.id))
                    return <button type="button" key={pokemon.id.toString()} onClick={() => { setPokemonId(pokemon.id) }}>{pokemon.name}</button>
            })
        }
    </div>
}

export function Pokemon({ pokemon }) {

    // useEffect(() => {

    // })

    if (!pokemon || !pokemon.name)
        return <></>
    return (
        <article key={pokemon.id}>
            <h4>
                {pokemon.name}
            </h4>
            <div>
                <img src={pokemon.sprites.front_default} />
            </div>
            <section>
                <h5>Stats</h5>
                <table>
                    <thead>
                        <tr>
                            {pokemon.stats.map((stat) => {
                                return <th key={stat.stat.name}>{stat.stat.name}</th>
                            })}
                            <th>total</th>
                            {/* <th>Hp</th>
                            <th>Attack</th>
                            <th>Defense</th>
                            <th>Special Attack</th>
                            <th>Special Defense</th>
                            <th>Speed</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {pokemon.stats.map((stat, index) => {
                                return <td key={index}>{stat.base_stat}</td>
                            })}

                            <td>{pokemon.stats.reduce((accumulator, stat) => accumulator + stat.base_stat, 0)}</td>

                            {/* <td>{pokemon.stats[0].base_stat}</td>
                            <td>{pokemon.stats[1].base_stat}</td>
                            <td>{pokemon.stats[2].base_stat}</td>
                            <td>{pokemon.stats[3].base_stat}</td>
                            <td>{pokemon.stats[4].base_stat}</td>
                            <td>{pokemon.stats[5].base_stat}</td> */}
                        </tr>
                    </tbody>
                </table>
            </section>
            <section>
                <h5>Types</h5>
                {pokemon.types.map((type) => {
                    return <div key={type.type.name}>{type.type.name}</div>
                })}
            </section>
        </article>
    )
}