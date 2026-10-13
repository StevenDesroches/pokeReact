import { useState, useEffect, useContext, useRef } from 'react'
// import * as pokeApi from '../../../lib/pokeApi/pokemon'

import { useTranslation } from "react-i18next";


import { PokemonsContext } from '@/contexts/PokemonsContext';
import { Button, Grid, TextInput, ScrollArea } from '@mantine/core';
import { useVirtualizer } from '@tanstack/react-virtual';
import Pokemon from '@/components/pokemons/pokedex/Pokemon';

import { usePokemon } from '@/queries/pokemon';
import { capitalizeWords } from '@/utils/generic';




export default function Pokedex({ isVisible }) {
    const [displayedPokemonIds, setDisplayedPokemonIds] = useState([]);
    const [pokemonId, setPokemonId] = useState(null);

    useEffect(() => {
        if (pokemonId === null && displayedPokemonIds.length > 0) {
            setPokemonId(displayedPokemonIds[0]);
        }
    }, [displayedPokemonIds, pokemonId]);

    const { data: pokemon, isLoading, error } = usePokemon(pokemonId);

    return <>
        <Grid style={{ display: isVisible ? undefined : 'none' }} >
            <Grid.Col span={2} >
                {/* <Container> */}
                <SearchBar setDisplayedPokemonIds={setDisplayedPokemonIds}></SearchBar>
                <List displayedPokemonIds={displayedPokemonIds} setPokemonId={setPokemonId}></List>
                {/* </Container> */}
            </Grid.Col>
            <Grid.Col span={10}>
                <Pokemon pokemon={pokemon} isLoading={isLoading} error={error}></Pokemon>
            </Grid.Col>
        </Grid>
    </>
}

export function SearchBar({ setDisplayedPokemonIds }) {
    const [query, setQuery] = useState("");

    const { i18n, t } = useTranslation();
    const pokemons = useContext(PokemonsContext);

    useEffect(() => {
        const q = query.trim().toLowerCase();
        if (q) {
            const pokemonsFound = pokemons.filter((pokemon) => {

                let displayName = pokemon.name;
                if (pokemon.allNames && pokemon.allNames[i18n.language])
                    displayName = pokemon.allNames[i18n.language];
                // const allNames = pokemon.allNames ?? [];

                const matchDisplayName = displayName.toLowerCase().includes(q);
                // const matchAllNames = allNames.some((n) => n.toLowerCase().includes(q));

                return matchDisplayName;
                // return matchDisplayName || matchAllNames;
            });
            setDisplayedPokemonIds(pokemonsFound.map((p) => p.id));
        } else {
            setDisplayedPokemonIds(pokemons.map((p) => p.id));
        }

    }, [query, pokemons, setDisplayedPokemonIds])


    return <TextInput placeholder={t("search")} mb=".5vh" radius="xs" value={query} onChange={(e) => setQuery(e.target.value)} />
}


export function List({ displayedPokemonIds, setPokemonId }) {
    const pokemons = useContext(PokemonsContext);
    const scrollRef = useRef(null);

    const displayedPokemons = pokemons.filter(pokemon =>
        displayedPokemonIds.includes(pokemon.id)
    );

    const virtualizer = useVirtualizer({
        count: displayedPokemons.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 37,
        overscan: 5,
    });

    const virtualItems = virtualizer.getVirtualItems();

    const { i18n } = useTranslation();


    return <>
        <ScrollArea.Autosize h="85dvh" viewportRef={scrollRef}>
            <div style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative", }}>

                {
                    virtualItems.map(virtualItem => {
                        const pokemon = displayedPokemons[virtualItem.index];
                        // return <PokedexButton pokemon={pokemon} setPokemonId={setPokemonId} virtualItem={virtualItem}></PokedexButton>

                        // console.log(pokemon.translatedName);
                        // console.log(pokemon);


                        let pokemonName = capitalizeWords(pokemon.name);
                        if (pokemon.allNames && pokemon.allNames[i18n.language])
                            pokemonName = pokemon.allNames[i18n.language];

                        return <Button key={virtualItem.key} rightSection={<img src={pokemon.sprites.front_default} width={60} height={60} alt={pokemon.name} />} radius="xs" justify="space-between" variant="default" onClick={() => setPokemonId(pokemon.id)}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: `${virtualItem.size - 1}px`,
                                transform: `translateY(${virtualItem.start}px)`,
                            }}
                        >{pokemonName}</Button>

                    })
                }
            </div>
        </ScrollArea.Autosize>
    </>
}

// export function PokedexButton({ pokemon, setPokemonId, virtualItem }) {
//     let specieId = getIdFromUrl(pokemon.species.url);
//     const { i18n } = useTranslation();
//     const { data: specieDetail, isLoading, error } = useSpecies(specieId, i18n.language);

//     let pokemonName = !isLoading && !error ? specieDetail.translatedName : pokemon.name;

//     return <Button key={virtualItem.key} rightSection={<img src={pokemon.sprites.front_default} width={60} height={60} alt={pokemon.name} />} radius="xs" justify="space-between" variant="default" onClick={() => setPokemonId(pokemon.id)}
//         style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: `${virtualItem.size - 1}px`,
//             transform: `translateY(${virtualItem.start}px)`,
//         }}
//     >{pokemonName}</Button>
// }

// export function PokemonTitle({ pokemon }) {
//     let specieId = getIdFromUrl(pokemon.species.url);
//     const { data: specieDetail, isLoading, error } = useSpecies(specieId, 'fr');

//     if (isLoading || error)
//         return <Title order={2}>{pokemon.name}</Title>
//     return <Title order={2}>{specieDetail.translatedName}</Title>

// }
