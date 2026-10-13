import * as pokeApi from '@/lib/pokeApi/pokemon';
// import { Box, Text } from '@mantine/core';

import StartScreen from './StartScreen';
import PlayingScreen from './PlayingScreen';
import WonScreen from './WonScreen';

interface GameContentProps {
    pokemon?: pokeApi.Pokemon;
    gameWon: boolean;
    attempts: number;
    pokemonInput: string;

    setPokemonInput: React.Dispatch<React.SetStateAction<string>>;
    setGameWon: React.Dispatch<React.SetStateAction<boolean>>;
    setAttempts: React.Dispatch<React.SetStateAction<number>>;
}

export default function GameContent({
    pokemon,
    gameWon,
    attempts,
    pokemonInput,
    setPokemonInput,
    setGameWon,
    setAttempts,
}: GameContentProps) {

    if (!pokemon) {
        return <StartScreen />;
    }

    if (gameWon) {
        return (
            <WonScreen pokemon={pokemon} />
        );
    }

    return (
        <PlayingScreen
            pokemon={pokemon}
            attempts={attempts}
            pokemonInput={pokemonInput}
            setPokemonInput={setPokemonInput}
            setGameWon={setGameWon}
            setAttempts={setAttempts}
        />
    );
}
