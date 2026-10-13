import { Slider, Text, Group, Table, Title, Box } from '@mantine/core';
import type * as pokeApi from '@/lib/pokeApi/pokemon';

export default function Pokemon({ pokemon }: { pokemon: pokeApi.Pokemon }) {

    let totalStat = pokemon.stats.reduce((accumulator, stat) => accumulator + stat.base_stat, 0);

    return (
        <Box>
            <Title order={3}>Stats</Title>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        {pokemon.stats.map((stat) => {
                            return <Table.Th>{stat.stat.name}</Table.Th>
                        })}
                        <Table.Th>Total</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    <Table.Tr>
                        {pokemon.stats.map((stat) => {
                            return <Table.Td>{stat.base_stat}</Table.Td>
                        })}
                        <Table.Td>{totalStat}</Table.Td>
                    </Table.Tr>

                </Table.Tbody>
            </Table>
            {pokemon.stats.map((stat) => {
                return <>
                    <Group>
                        <Slider key={stat.stat.name} defaultValue={(stat.base_stat / totalStat) * 100} min={0} max={100} styles={{ thumb: { display: 'none', }, }} style={{ pointerEvents: 'none' }} w="50%" color="green" />
                        <Text size="sm">{stat.stat.name}</Text>
                    </Group>
                </>
            })}
        </Box>
    )
}