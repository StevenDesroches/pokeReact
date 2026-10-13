export async function getPokemon(id: number): Promise<Pokemon> {
    // fetch("https://pokeapi.co/api/v2/pokemon").then(response => response.json()).then(console.log)
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon: ${response.status} ${response.statusText}`);
    }

    const pokemon = (await response.json()) as Pokemon;
    return pokemon;
}

export async function getPokemons(limit: number = 20, offset: number = 0) {
    // fetch("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0").then(response => response.json()).then(console.log)
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon: ${response.status} ${response.statusText}`);
    }

    // Type de la réponse brute de l'API pour la liste
    type PokemonListResponse = {
        count: number;
        next: string | null;
        previous: string | null;
        results: { name: string; url: string }[];
    };

    const data = (await response.json()) as PokemonListResponse;

    // Si tu veux récupérer les détails de chaque Pokémon (optionnel, mais souvent utile)
    const pokemons: Pokemon[] = await Promise.all(
        data.results.map(async (p) => {
            // L'URL de l'API est déjà dans p.url, on peut l'utiliser directement
            const res = await fetch(p.url);
            if (!res.ok) {
                throw new Error(`Failed to fetch Pokémon details: ${res.status} ${res.statusText}`);
            }
            return (await res.json()) as Pokemon;
        })
    );

    const pokemonList: PokemonList = {
        count: data.count,
        limit,
        offset,
        page: Math.floor(offset / limit) + 1,
        pokemons,
    };


    return pokemonList;
}







export interface PokemonList {
    count: number;
    limit: number;
    offset: number;
    page: number;
    pokemons: Pokemon[];
}



export interface Pokemon {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    is_default: boolean;
    order: number;
    weight: number;
    abilities: PokemonAbility[];
    forms: NameUrl[];
    game_indices: GameIndex[];
    held_items: HeldItem[];
    location_area_encounters: string;
    moves: Move[];
    species: NameUrl;
    sprites: Sprites;
    cries: Cries;
    stats: Stat[];
    types: PokemonType[];
    past_types: PastType[];
    past_abilities: PastAbility[];
}

export interface NameUrl {
    name: string;
    url: string;
}

export interface PokemonAbility {
    is_hidden: boolean;
    slot: number;
    ability: NameUrl | null;
}

export interface GameIndex {
    game_index: number;
    version: NameUrl;
}

export interface HeldItem {
    item: NameUrl;
    version_details: VersionDetail[];
}

export interface VersionDetail {
    rarity: number;
    version: NameUrl;
}

export interface Move {
    move: NameUrl;
    version_group_details: VersionGroupDetail[];
}

export interface VersionGroupDetail {
    level_learned_at: number;
    version_group: NameUrl;
    move_learn_method: NameUrl;
    order: number;
}

export interface Sprites {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    other: OtherSprites;
    versions: GenerationVersions;
}

export interface OtherSprites {
    dream_world: DreamWorld;
    home: Home;
    "official-artwork": OfficialArtwork;
    showdown: Showdown;
}

export interface DreamWorld {
    front_default: string | null;
    front_female: string | null;
}

export interface Home {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
}

export interface OfficialArtwork {
    front_default: string | null;
    front_shiny: string | null;
}

export interface Showdown {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
}

export interface GenerationVersions {
    "generation-i": GenerationI;
    "generation-ii": GenerationII;
    "generation-iii": GenerationIII;
    "generation-iv": GenerationIV;
    "generation-v": GenerationV;
    "generation-vi": GenerationVI;
    "generation-vii": GenerationVII;
    "generation-viii": GenerationVIII;
}

export interface GenerationI {
    "red-blue": RedBlue;
    yellow: Yellow;
}

export interface RedBlue {
    back_default: string | null;
    back_gray: string | null;
    front_default: string | null;
    front_gray: string | null;
}

export interface Yellow {
    back_default: string | null;
    back_gray: string | null;
    front_default: string | null;
    front_gray: string | null;
}

export interface GenerationII {
    crystal: Crystal;
    gold: Gold;
    silver: Silver;
}

export interface Crystal {
    back_default: string | null;
    back_shiny: string | null;
    front_default: string | null;
    front_shiny: string | null;
}

export interface Gold {
    back_default: string | null;
    back_shiny: string | null;
    front_default: string | null;
    front_shiny: string | null;
}

export interface Silver {
    back_default: string | null;
    back_shiny: string | null;
    front_default: string | null;
    front_shiny: string | null;
}

export interface GenerationIII {
    emerald: Emerald;
    "firered-leafgreen": FireredLeafgreen;
    "ruby-sapphire": RubySapphire;
}

export interface Emerald {
    front_default: string | null;
    front_shiny: string | null;
}

export interface FireredLeafgreen {
    back_default: string | null;
    back_shiny: string | null;
    front_default: string | null;
    front_shiny: string | null;
}

export interface RubySapphire {
    back_default: string | null;
    back_shiny: string | null;
    front_default: string | null;
    front_shiny: string | null;
}

export interface GenerationIV {
    "diamond-pearl": DiamondPearl;
    "heartgold-soulsilver": HeartgoldSoulsilver;
    platinum: Platinum;
}

export interface DiamondPearl {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
}

export interface HeartgoldSoulsilver {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
}

export interface Platinum {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
}

export interface GenerationV {
    "black-white": BlackWhite;
}

export interface BlackWhite {
    animated?: Animated;
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
}

export interface Animated {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
}

export interface GenerationVI {
    "omegaruby-alphasapphire": OmegarubyAlphasapphire;
    "x-y": XY;
}

export interface OmegarubyAlphasapphire {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
}

export interface XY {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
}

export interface GenerationVII {
    icons: Icons;
    "ultra-sun-ultra-moon": UltraSunUltraMoon;
}

export interface Icons {
    front_default: string | null;
    front_female: string | null;
}

export interface UltraSunUltraMoon {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
}

export interface GenerationVIII {
    icons: Icons;
}

export interface Cries {
    latest: string;
    legacy: string;
}

export interface Stat {
    base_stat: number;
    effort: number;
    stat: NameUrl;
}

export interface PokemonType {
    slot: number;
    type: NameUrl;
}

export interface PastType {
    generation: NameUrl;
    types: PokemonType[];
}

export interface PastAbility {
    generation: NameUrl;
    abilities: PastAbilityEntry[];
}

export interface PastAbilityEntry {
    ability: NameUrl | null;
    is_hidden: boolean;
    slot: number;
}