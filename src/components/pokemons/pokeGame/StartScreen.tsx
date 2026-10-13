import { useContext } from 'react'
import { Text, Center, AspectRatio, Image, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { PokemonsContext } from '@/contexts/PokemonsContext';


export default function StartScreen() {
    const { t } = useTranslation();

    return (
        <Center h="100%">
            <Stack align="center" w="100%">
                <PokemonImage></PokemonImage>
                <Text c="dimmed" size="lg">
                    {t("press new game to start")}
                </Text>
            </Stack >
        </Center >
    );
}

function PokemonImage() {
    const pokemons = useContext(PokemonsContext);
    let pokemon = pokemons[0];

    const blackImgStyle = {
        filter: 'brightness(0%)',
        imageRendering: 'crisp-edges' as any,
    };
    if (pokemon)
    return (
        <AspectRatio
            ratio={16 / 9}
            w="100%"
            style={{ maxWidth: 400 }}
        >

            <Image
                style={blackImgStyle}
                src={pokemon.sprites.front_default}
            />
        </AspectRatio>
    )
    return <></>
}