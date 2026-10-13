export async function getSpecies(id: number, shortLang?: string): Promise<Species> {
    // ex: https://pokeapi.co/api/v2/pokemon-species/1/
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    console.log('getSpecies url', url);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch Species: ${response.status} ${response.statusText}`);
    }

    const rawSpecies = (await response.json()) as RawSpecies;

    let translatedName: string | undefined;
    if (shortLang) {
        const filtered = rawSpecies.names.filter((n) => n.language.name === shortLang);
        if (filtered.length > 0) {
            translatedName = filtered[0].name;
        }
    }

    const species: Species = {
        id: rawSpecies.id,
        name: rawSpecies.name, // nom interne (ex: "bulbasaur")
        names: rawSpecies.names.map((n) => ({
            name: n.name,
            language: n.language.name,
        })),
        translatedName,
    };

    return species;
}

interface RawSpecies {
    id: number;
    name: string;
    names: {
        name: string;
        language: {
            name: string;
            url: string;
        };
    }[];
}

export interface Species {
    id: number;
    name: string; // internal name (anglais, slug)
    names: SpeciesNameEntry[];
    translatedName?: string; // ex: nom en "fr"
}

export interface SpeciesNameEntry {
    name: string;
    language: string;
}