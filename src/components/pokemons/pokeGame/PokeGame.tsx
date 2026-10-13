import { useContext, useState } from 'react';
import * as pokeApi from '@/lib/pokeApi/pokemon';
import { PokemonsContext } from '@/contexts/PokemonsContext';
import { Container, Box, Button, Flex } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import StartScreen from './StartScreen';
import PlayingScreen from './PlayingScreen';
import WonScreen from './WonScreen';

export default function PokeGame({ isVisible }) {
    const [randomPokemon, setRandomPokemon] =
        useState<pokeApi.Pokemon>();

    const [pokemonInput, setPokemonInput] = useState<string>("");
    const [gameWon, setGameWon] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const { t } = useTranslation();
    const pokemons = useContext(PokemonsContext);

    function startGame() {
        if (pokemons.length === 0) return;

        const randomIndex = Math.floor(
            Math.random() * pokemons.length
        );

        setRandomPokemon(pokemons[randomIndex]);
        setPokemonInput("");
        setGameWon(false);
        setAttempts(0);
    }

    return (
        <Container
            className="glass-panel"
            h="100%"
            p="xs"
            style={{
                display: isVisible ? 'flex' : 'none',
            }}
        >
            <Flex
                direction="column"
                w="100%"
                h="100%"
            >
                <Flex justify="flex-end">
                    <Button
                        variant="default"
                        radius="xs"
                        onClick={startGame}
                    >
                        {t("new game")}
                    </Button>
                </Flex>

                <Box
                    style={{
                        flex: 1,
                        paddingBottom: 'xs',
                    }}
                >
                    <PokeGameContent
                        pokemon={randomPokemon}
                        gameWon={gameWon}
                        attempts={attempts}
                        pokemonInput={pokemonInput}
                        setPokemonInput={setPokemonInput}
                        setGameWon={setGameWon}
                        setAttempts={setAttempts}
                    />
                </Box>
            </Flex>
        </Container>
    );
}


// interface GameContentProps {
//     pokemon?: pokeApi.Pokemon;
//     gameWon: boolean;
//     attempts: number;
//     pokemonInput: string;

//     setPokemonInput: React.Dispatch<React.SetStateAction<string>>;
//     setGameWon: React.Dispatch<React.SetStateAction<boolean>>;
//     setAttempts: React.Dispatch<React.SetStateAction<number>>;
// }

function PokeGameContent({
    pokemon,
    gameWon,
    attempts,
    pokemonInput,
    setPokemonInput,
    setGameWon,
    setAttempts,
}) {

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

