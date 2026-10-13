export * from "./pokemon";
// import *  as pokemon from "./pokemon";

// export async function getPokemon(id?: number): Promise<Pokemon> {
//     // fetch("https://pokeapi.co/api/v2/pokemon").then(response => response.json()).then(console.log)
//     let url = `https://pokeapi.co/api/v2/pokemon`;
//     if (id != null)
//         url += `/${id}`;

//     const response = await fetch(url);
//     if (!response.ok) {
//         throw new Error(`Failed to fetch Pokémon: ${response.status} ${response.statusText}`);
//     }

//     const data = (await response.json()) as Pokemon;
//     return data;
// }