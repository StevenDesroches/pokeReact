import { useContext, useState, type Dispatch, type SetStateAction } from 'react';
import { PokemonsContext } from '@/contexts/PokemonsContext';
import { Container, Box, Button, Flex } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import StartScreen from './StartScreen';
import PlayingScreen from './PlayingScreen';
import WonScreen from './WonScreen';

import { type PokemonListItem } from '@/contexts/PokemonsContext';

export default function PokeGame({ isVisible }: { isVisible: boolean }) {
    const [randomPokemon, setRandomPokemon] =
        useState<PokemonListItem>();

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

interface PokeGameContentProps {
    pokemon: PokemonListItem | undefined;
    gameWon: boolean;
    attempts: number;
    pokemonInput: string;
    setPokemonInput: Dispatch<SetStateAction<string>>;
    setGameWon: Dispatch<SetStateAction<boolean>>;
    setAttempts: Dispatch<SetStateAction<number>>;
}

function PokeGameContent({
    pokemon,
    gameWon,
    attempts,
    pokemonInput,
    setPokemonInput,
    setGameWon,
    setAttempts,
}: PokeGameContentProps) {

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

