import { createContext, useEffect, useState } from "react";
import * as pokeApi from "../lib/pokeApi/pokemon";
import { usePokemons } from '../queries/pokemon';

export const PokemonsContext = createContext<pokeApi.Pokemon[]>([]);

export function PokemonsProvider({ children }: { children: React.ReactNode }) {
  const limit = 20;
  const [page, setPage] = useState(0);

  // One hook call, at the top level
//   const { data: pokemonList, isLoading, error } = usePokemons(limit, page * limit);
  const { data: pokemonList } = usePokemons(limit, page * limit);

  const [allPokemons, setAllPokemons] = useState<pokeApi.Pokemon[]>([]);
  const [hasLoadedAll, setHasLoadedAll] = useState(false);

  // When a new page arrives, append it
  useEffect(() => {
    if (!pokemonList) return;

    setAllPokemons(prev => {
      const merged = [...prev, ...pokemonList.pokemons];
      const done = merged.length >= pokemonList.count;
      if (done) setHasLoadedAll(true);
      return merged;
    });
  }, [pokemonList]);

  // If we haven’t loaded everything yet, go to next page
  useEffect(() => {
    if (!pokemonList || hasLoadedAll) return;

    const total = pokemonList.count;
    const loaded = allPokemons.length;

    if (loaded < total) {
      setPage(p => p + 1);
    }
  }, [pokemonList, allPokemons.length, hasLoadedAll]);

  return <PokemonsContext value={allPokemons}>{children}</PokemonsContext>;

}