import { Container, Slider, Text, Group, Table, Title, Pill, Box, Image, AspectRatio, Skeleton } from '@mantine/core';
// import * as pokeApi from '../../../lib/pokeApi/stats'
import { useTranslation } from "react-i18next";


import { useSpecies, useStat, useTypes } from '@/queries/pokemon';
import { getIdFromUrl, capitalizeWords } from '@/utils/generic';
import type * as pokeApi from '@/lib/pokeApi/pokemon';



interface PokemonProps {
    pokemon: pokeApi.Pokemon | undefined;
    isLoading: boolean;
    error: Error | null;
}

export default function Pokemon({ pokemon, isLoading, error, }: PokemonProps) {
    const { t } = useTranslation();

    if(isLoading || error || !pokemon || !pokemon.name)
        return <></>;

    let totalStat = pokemon.stats.reduce((accumulator, stat) => accumulator + stat.base_stat, 0);

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

interface PokemonTitleProps {
    pokemon: pokeApi.Pokemon;
}
export function PokemonTitle({ pokemon }: PokemonTitleProps) {
    let specieId = getIdFromUrl(pokemon.species.url);
    if (!specieId)
        specieId = 0;
    const { i18n } = useTranslation();

    const { data: specieDetail, isLoading, error } = useSpecies(specieId, i18n.language);

    if (isLoading || error || !specieDetail)
        return <Title order={2}>{capitalizeWords(pokemon.name)}</Title>
    return <Title order={2}>{specieDetail.translatedName}</Title>

}

interface StatHeadCellProps {
    stat: pokeApi.Pokemon['stats'][number]['stat'];
}
export function StatHeadCell({ stat }: StatHeadCellProps) {
    let statId = getIdFromUrl(stat.url);
    if (!statId)
        statId = 0;
    const { i18n } = useTranslation();

    const { data: statDetail, isLoading, error } = useStat(statId, i18n.language);

    if (isLoading || error || !statDetail)
        return <Skeleton height={8} radius="xl" />
    return <Table.Th>{statDetail.translatedName}</Table.Th>
}

interface StatSliderProps {
    stat: pokeApi.Pokemon['stats'][number];
    totalStat: number;
}
export function StatSlider({ stat, totalStat }: StatSliderProps) {
    let statId = getIdFromUrl(stat.stat.url);
    if (!statId)
        statId = 0;
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

    if (isLoading || error || !statDetail)
        return <Skeleton height={8} radius="xl" />
    return <Group>
        <Slider key={stat.stat.name} defaultValue={(stat.base_stat / totalStat) * 100} min={0} max={100} styles={{ thumb: { display: 'none', }, }} style={{ pointerEvents: 'none' }} w="50%" color={statColor} />
        <Text size="sm">{statDetail.translatedName}</Text>
    </Group>
}


interface TypeBadgeProps {
    type: pokeApi.Pokemon['types'][number]['type'];
}
export function TypeBadge({ type }: TypeBadgeProps) {
    let typeId = getIdFromUrl(type.url);
    if (!typeId)
        typeId = 0;

    const { i18n } = useTranslation();

    const { data: typeDetail, isLoading, error } = useTypes(typeId, i18n.language);

    let typeColor: string;
    switch (typeId) {
        default:
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

    if (isLoading || error || !typeDetail)
        return <Pill style={{ backgroundColor: typeColor }} radius="xs">{capitalizeWords(type.name)}</Pill>
    return <Pill style={{ backgroundColor: typeColor }} radius="xs">{typeDetail.translatedName}</Pill>
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