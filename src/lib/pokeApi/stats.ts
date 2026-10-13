
export async function getStat(id: number, shortLang?: string): Promise<Stat> {
    // fetch("https://pokeapi.co/api/v2/stat/1/").then(response => response.json()).then(console.log)
    let url = `https://pokeapi.co/api/v2/stat/${id}`;
    console.log('getStat url', url);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch Stat: ${response.status} ${response.statusText}`);
    }

    const rawStat = (await response.json()) as RawStat;

    let translatedName: string | undefined;
    if (shortLang) {
        rawStat.names = rawStat.names.filter((lang) => {
            if (lang.language.name == shortLang)
                return true;
            return false;
        })
        translatedName = rawStat.names[0].name;
    }

    const stat: Stat = {
        id: rawStat.id,
        name: rawStat.name,
        names: rawStat.names.map((n) => ({
            name: n.name,
            language: n.language.name,
        })),
        translatedName: translatedName
    };

    return stat;
}


interface RawStat {
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

export interface Stat {
    id: number;
    name: string;//internal name
    names: StatNameEntry[];
    translatedName?: string;
}
export interface StatNameEntry {
    name: string;
    language: string;
}


