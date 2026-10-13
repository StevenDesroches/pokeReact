import { type PokemonListItem } from '@/contexts/PokemonsContext';
import {
    AspectRatio,
    Box,
    Button,
    Flex,
    Image,
    TextInput,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface Props {
    pokemon: PokemonListItem;
    attempts: number;
    pokemonInput: string;

    setPokemonInput: React.Dispatch<React.SetStateAction<string>>;
    setGameWon: React.Dispatch<React.SetStateAction<boolean>>;
    setAttempts: React.Dispatch<React.SetStateAction<number>>;
}

export default function PlayingScreen({
    pokemon,
    attempts,
    pokemonInput,
    setPokemonInput,
    setGameWon,
    setAttempts,
}: Props) {

    const { i18n, t } = useTranslation();

    function isPokemonValid() {
        let pokemonName = pokemon.name;
        if (pokemon.allNames && pokemon.allNames[i18n.language])
            pokemonName = pokemon.allNames[i18n.language].toLocaleLowerCase();

        if (pokemonInput.toLocaleLowerCase() === pokemonName) {
            setGameWon(true);
        }

        setAttempts(attempts + 1);
    }

    const clipPaths = [
        'polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)',
        'polygon(0% 0%, 50% 0%, 50% 50%, 0% 50%)',
        'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)',
        'polygon(0% 0%, 100% 0%, 100% 50%, 50% 50%, 50% 100%, 0% 100%)',
        'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    ];

    const coloredImgStyle = {
        zIndex: 1,
        clipPath: clipPaths[attempts],
        imageRendering: 'crisp-edges' as any,
    };

    const blackImgStyle = {
        filter: 'brightness(0%)',
        imageRendering: 'crisp-edges' as any,
    };

    return (
        <>
            <AspectRatio
                ratio={16 / 9}
                mx="auto"
                style={{ maxWidth: 400 }}
            >
                <Box style={{ position: 'relative' }}>
                    <Image
                        pos="absolute"
                        fit="contain"
                        style={coloredImgStyle}
                        src={pokemon.sprites.front_default}
                    />

                    <Image
                        fit="contain"
                        style={blackImgStyle}
                        src={pokemon.sprites.front_default}
                    />
                </Box>
            </AspectRatio>

            <Flex gap="xs">
                <TextInput
                    radius="xs"
                    style={{ flex: 4 }}
                    value={pokemonInput}
                    onChange={(e) =>
                        setPokemonInput(e.target.value)
                    }
                />

                <Button
                    variant="default"
                    radius="xs"
                    style={{ flex: 1 }}
                    onClick={isPokemonValid}
                >
                    {t("send")}
                </Button>
            </Flex>
        </>
    );
}
