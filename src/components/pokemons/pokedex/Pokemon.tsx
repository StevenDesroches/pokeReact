import { Container, Slider, Text, Group, Table, Title, Pill, Box, Image, AspectRatio, Skeleton } from '@mantine/core';
// import * as pokeApi from '../../../lib/pokeApi/stats'
import { useTranslation } from "react-i18next";


import { useSpecies, useStat, useTypes } from '@/queries/pokemon';
import { getIdFromUrl, capitalizeWords } from '@/utils/generic';




export default function Pokemon({ pokemon, isLoading, error, }) {
    const { t } = useTranslation();

    // if (!pokemon || !pokemon.name)
    //     return <></>

    // if (isLoading) return <PokemonLoading />;
    // if (!pokemon) return <div>No Pokémon selected</div>;
    // if (isLoading) return <div>Is loading...</div>;
    // if (error) return <div>Error: {error.message}</div>;

    let isReady = !isLoading && !error && pokemon && pokemon.name
    if (!isReady)
        return <></>;

    let totalStat = pokemon.stats.reduce((accumulator, stat) => accumulator + stat.base_stat, 0);
    // console.log('pokemon', pokemon);

    return (
        <Container key={pokemon.id} className="glass-panel" h="100%">
            <PokemonTitle pokemon={pokemon}></PokemonTitle>
            <Box>
                <AspectRatio ratio={16 / 9} mx="auto" style={{ maxWidth: 400 }}>
                    <Image fit="contain" style={{ imageRendering: 'crisp-edges' }} src={pokemon.sprites.front_default}></Image>
                </AspectRatio>
            </Box>
            <Box>
                <Title order={3}>{t("Stats")}</Title>

                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            {pokemon.stats.map((stat) => {
                                return <StatHeadCell stat={stat.stat}></StatHeadCell>
                            })}
                            <Table.Th>{t("Total")}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            {pokemon.stats.map((stat) => {
                                return <Table.Td><strong>{stat.base_stat}</strong></Table.Td>
                            })}
                            <Table.Td><strong>{totalStat}</strong></Table.Td>
                        </Table.Tr>

                    </Table.Tbody>
                </Table>
                {pokemon.stats.map((stat) => {
                    return <StatSlider stat={stat} totalStat={totalStat}></StatSlider>
                })}
            </Box>
            <Box>
                <Title order={3}>{t("Types")}</Title>
                <Group gap="xs" mt={10}>
                    {pokemon.types.map((type) => {
                        return <TypeBadge key={`${pokemon.id}-${type.type.name}`} type={type.type}></TypeBadge>
                    })}
                </Group>
            </Box>
        </Container>
    )
}

export function PokemonTitle({ pokemon }) {
    let specieId = getIdFromUrl(pokemon.species.url);
    const { i18n } = useTranslation();

    const { data: specieDetail, isLoading, error } = useSpecies(specieId, i18n.language);

    if (isLoading || error)
        return <Title order={2}>{capitalizeWords(pokemon.name)}</Title>
    return <Title order={2}>{specieDetail.translatedName}</Title>

}

export function StatHeadCell({ stat }) {
    let statId = getIdFromUrl(stat.url);
    const { i18n } = useTranslation();

    const { data: statDetail, isLoading, error } = useStat(statId, i18n.language);

    if (isLoading || error)
        return <Skeleton height={8} radius="xl" />
    return <Table.Th>{statDetail.translatedName}</Table.Th>
}

export function StatSlider({ stat, totalStat }) {
    let statId = getIdFromUrl(stat.stat.url);
    const { i18n } = useTranslation();

    const { data: statDetail, isLoading, error } = useStat(statId, i18n.language);
    let statColor;
    switch (statId) {
        case 1:
            statColor = "green";
            break;
        case 2:
            statColor = "yellow";
            break;
        case 3:
            statColor = "orange";
            break;
        case 4:
            statColor = "blue";
            break;
        case 5:
            statColor = "purple";
            break;
        case 6:
            statColor = "pink";
            break;
    }

    if (isLoading || error)
        return <Skeleton height={8} radius="xl" />
    return <Group>
        <Slider key={stat.stat.name} defaultValue={(stat.base_stat / totalStat) * 100} min={0} max={100} styles={{ thumb: { display: 'none', }, }} style={{ pointerEvents: 'none' }} w="50%" color={statColor} />
        <Text size="sm">{statDetail.translatedName}</Text>
    </Group>
}

export function TypeBadge({ type }) {
    let typeId = getIdFromUrl(type.url);
    const { i18n } = useTranslation();

    const { data: typeDetail, isLoading, error } = useTypes(typeId, i18n.language);

    let typeColor;
    switch (typeId) {
        case 1://normal
            typeColor = "#aab09f";
            break;
        case 2://fighting
            typeColor = "#cb5f48";
            break;
        case 3://flying
            typeColor = "#7da6de";
            break;
        case 4://poison
            typeColor = "#b468b7";
            break;
        case 5://ground
            typeColor = "#cc9f4f";
            break;
        case 6://rock
            typeColor = "#b2a061";
            break;
        case 7://bug
            typeColor = "#94bc4a";
            break;
        case 8://ghost
            typeColor = "#846ab6";
            break;
        case 9://steel
            typeColor = "#89a1b0";
            break;
        case 10://fire
            typeColor = "#ea7a3c";
            break;
        case 11://water
            typeColor = "#539ae2";
            break;
        case 12://grass
            typeColor = "#71c558";
            break;
        case 13://electrc
            typeColor = "#e5c531";
            break;
        case 14://psyhic
            typeColor = "#e5709b";
            break;
        case 15://ice
            typeColor = "#70cbd4";
            break;
        case 16://dragon
            typeColor = "#6a7baf";
            break;
        case 17://dark
            typeColor = "#736c75";
            break;
        case 18://fairy
            typeColor = "#e397d1";
            break;
        case 19://stellar
            typeColor = "#81a596";
            break;
    }

    if (isLoading || error)
        return <Pill style={{ backgroundColor: typeColor }} radius="xs">{capitalizeWords(type.name)}</Pill>
    return <Pill style={{ backgroundColor: typeColor }} radius="xs">{typeDetail.translatedName}</Pill>
    // return <Table.Th>{typeDetail.translatedName}</Table.Th>
}

export function PokemonLoading() {
    return <Container className="glass-panel" h="100%">
        <Skeleton>
            <Title order={2}>Lorem</Title>
            <Box>
                {/* <AspectRatio ratio={16 / 9} mx="auto" style={{ maxWidth: 400 }}>
                <Image fit="contain" style={{ imageRendering: 'crisp-edges' }} src={pokemon.sprites.front_default}></Image>
                </AspectRatio> */}
            </Box>
            <Box>
                <Title order={3}>Stats</Title>

                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            {/* {pokemon.stats.map((stat) => {
                            return <Table.Th>{stat.stat.name}</Table.Th>
                            })} */}
                            <Table.Th>Total</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            {/* {pokemon.stats.map((stat) => {
                            return <Table.Td>{stat.base_stat}</Table.Td>
                            })}
                            <Table.Td>{totalStat}</Table.Td> */}
                            <Table.Td>0</Table.Td>
                        </Table.Tr>

                    </Table.Tbody>
                </Table>
                {/* {pokemon.stats.map((stat) => {
                let statId = getIdFromUrl(stat.stat.url);
                let statColor;
                switch (statId) {
                    case 1:
                        statColor = "green";
                        break;
                        case 2:
                            statColor = "yellow";
                            break;
                            case 3:
                                statColor = "orange";
                                break;
                                case 4:
                                    statColor = "blue";
                                    break;
                                    case 5:
                                        statColor = "purple";
                                        break;
                                        case 6:
                                            statColor = "pink";
                                            break;
                                            }
                                            
                                            
                                            return <>
                                            <Group>
                                            <Slider key={stat.stat.name} defaultValue={(stat.base_stat / totalStat) * 100} min={0} max={100} styles={{ thumb: { display: 'none', }, }} style={{ pointerEvents: 'none' }} w="50%" color={statColor} />
                                            <Text size="sm">{stat.stat.name}</Text>
                                            </Group>
                                            </>
                                            })} */}
            </Box>
            {/* <Box>
            <Title order={3}>Types</Title>
            <Group gap="xs">
            {pokemon.types.map((type) => {
                return <Pill key={`${pokemon.id}-${type.type.name}`} radius="xs">{type.type.name}</Pill>
                })}
                </Group>
                </Box> */}
        </Skeleton>
    </Container>
}