export async function getTypes(id: number, shortLang?: string): Promise<Types> {
    const url = `https://pokeapi.co/api/v2/type/${id}`;
    console.log('getTypes url', url);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch Types: ${response.status} ${response.statusText}`);
    }

    const rawTypes = (await response.json()) as RawTypes;

    let translatedName: string | undefined;
    if (shortLang) {
        const filtered = rawTypes.names.filter((n) => n.language.name === shortLang);
        if (filtered.length > 0) {
            translatedName = filtered[0].name;
        }
    }

    const species: Types = {
        id: rawTypes.id,
        name: rawTypes.name, // nom interne (ex: "bulbasaur")
        names: rawTypes.names.map((n) => ({
            name: n.name,
            language: n.language.name,
        })),
        translatedName,
    };

    return species;
}

interface RawTypes {
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

export interface Types {
    id: number;
    name: string; // internal name (anglais, slug)
    names: TypeNameEntry[];
    translatedName?: string; // ex: nom en "fr"
}

export interface TypeNameEntry {
    name: string;
    language: string;
}