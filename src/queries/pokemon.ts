// src/queries/pokemon.ts
import { queryOptions, useQuery } from '@tanstack/react-query';
import { getPokemon, getPokemons, type Pokemon, type PokemonList } from '../lib/pokeApi/pokeApi';
import { getStat, type Stat } from '@/lib/pokeApi/stats';
import { getSpecies, type Species } from '@/lib/pokeApi/species';
import { getTypes, type Types } from '@/lib/pokeApi/types';

// ---------- queryOptions (core abstraction) ----------

export const pokemonQueryOptions = (id: number) =>
    queryOptions<Pokemon>({
        queryKey: ['pokemon', id] as const,
        queryFn: () => getPokemon(id),
        staleTime: Infinity
    });

export const pokemonsQueryOptions = (limit: number = 20, offset: number = 0) =>
    queryOptions<PokemonList>({
        queryKey: ['pokemons', limit, offset] as const,
        queryFn: () => getPokemons(limit, offset),
        staleTime: Infinity
    });

export const statQueryOptions = (id: number, shortLang?: string) =>
    queryOptions<Stat>({
        queryKey: ['stat', id, shortLang] as const,
        queryFn: () => getStat(id, shortLang),
        staleTime: Infinity
    });

export const speciesQueryOptions = (id: number, shortLang?: string) =>
    queryOptions<Species>({
        queryKey: ['species', id, shortLang] as const,
        queryFn: () => getSpecies(id, shortLang),
        staleTime: Infinity
    });

export const typesQueryOptions = (id: number, shortLang?: string) =>
    queryOptions<Types>({
        queryKey: ['Types', id, shortLang] as const,
        queryFn: () => getTypes(id, shortLang),
        staleTime: Infinity
    });

// ---------- optional thin hooks ----------

export function usePokemon(id: number) {
    return useQuery(pokemonQueryOptions(id));
}

export function usePokemons(limit: number = 20, offset: number = 0) {
    return useQuery(pokemonsQueryOptions(limit, offset));
}

export function useStat(id: number, shortLang?: string) {
    return useQuery(statQueryOptions(id, shortLang));
}

export function useSpecies(id: number, shortLang?: string) {
    return useQuery(speciesQueryOptions(id, shortLang));
}

export function useTypes(id: number, shortLang?: string) {
    return useQuery(typesQueryOptions(id, shortLang));
}