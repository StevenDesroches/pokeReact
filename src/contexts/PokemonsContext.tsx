import { createContext, useEffect, useState } from "react";
// import * as pokeApi from "../lib/pokeApi/pokemon";
import { usePokemons } from '@/queries/pokemon';
import {getIdFromUrl} from '@/utils/generic';


export interface PokemonListItem {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  species: {
    url: string;
  };
  // translatedName?: string;
  allNames?: { [k: string]: string; };
}

export const PokemonsContext = createContext<PokemonListItem[]>([]);

const LANGUAGES = ['fr', 'en'];

async function fetchSpeciesInChunks(
  ids: number[],
  chunkSize = 50
): Promise<
  {
    names: { name: string; language: { name: string } }[];
  }[]
> {
  const results: { names: { name: string; language: { name: string } }[] }[] = [];

  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(
      chunk.map(async (id) => {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`
        );
        if (!res.ok) throw new Error("species fetch failed");
        return (await res.json()) as {
          names: { name: string; language: { name: string } }[];
        };
      })
    );
    results.push(...chunkResults);
  }

  return results;
}

export function PokemonsProvider({ children }: { children: React.ReactNode }) {
  const limit = 20;
  const [page, setPage] = useState(0);

  const { data: pokemonList } = usePokemons(limit, page * limit);

  const [allPokemons, setAllPokemons] = useState<PokemonListItem[]>([]);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!pokemonList) return;

    // Évite de traiter deux fois la même page
    if (loadedPages.has(page)) return;

    setLoadedPages(prev => {
      const next = new Set(prev);
      next.add(page);
      return next;
    });

    const pokemonPage: PokemonListItem[] = pokemonList.pokemons.map(p => ({
      id: p.id,
      name: p.name,
      sprites: p.sprites,
      species: p.species,
      allNames: {},
    }));

    // Affichage immédiat
    setAllPokemons(prev => {
      const existingIds = new Set(prev.map(p => p.id));

      return [
        ...prev,
        ...pokemonPage.filter(p => !existingIds.has(p.id)),
      ];
    });

    // Puis enrichissement en arrière-plan
    enrichPokemonPage(pokemonPage);

    // Charge la page suivante
    if ((page + 1) * limit < pokemonList.count) {
      setPage(prev => prev + 1);
    }

  }, [pokemonList, page, loadedPages]);

  async function enrichPokemonPage(pokemons: PokemonListItem[]) {
    const ids = pokemons
      .map(p => getIdFromUrl(p.species.url))
      .filter((id): id is number => id !== null);

    try {
      const speciesDataList = await fetchSpeciesInChunks(ids);

      const enriched = pokemons.map((pokemon, index) => {
        const speciesData = speciesDataList[index];

        const allNames = Object.fromEntries(
          speciesData.names
            .filter(n => LANGUAGES.includes(n.language.name))
            .map(n => [n.language.name, n.name])
        );

        return {
          ...pokemon,
          allNames,
        };
      });

      setAllPokemons(prev => {
        const enrichedById = new Map(
          enriched.map(pokemon => [pokemon.id, pokemon])
        );

        return prev.map(pokemon =>
          enrichedById.get(pokemon.id) ?? pokemon
        );
      });

    } catch (error) {
      console.error("Failed to enrich Pokémon:", error);
    }
  }

  return (
    <PokemonsContext value={allPokemons}>
      {children}
    </PokemonsContext>
  );
}

