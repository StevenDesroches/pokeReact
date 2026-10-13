import * as pokeApi from '@/lib/pokeApi/pokemon';
import { AspectRatio, Box, Image, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface Props {
    pokemon: pokeApi.Pokemon;
}

export default function WonScreen({ pokemon }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <AspectRatio
                ratio={16 / 9}
                mx="auto"
                style={{ maxWidth: 400 }}
            >
                <Box>
                    <Image
                        fit="contain"
                        style={{
                            imageRendering: 'crisp-edges',
                        }}
                        src={pokemon.sprites.front_default}
                    />
                </Box>
            </AspectRatio>

            <Text>
                {t("you won")}
            </Text>
        </>
    );
}
