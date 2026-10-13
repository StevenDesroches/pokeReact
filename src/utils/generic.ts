
export function getIdFromUrl(url: string): number | null {
    const segments = new URL(url).pathname.split("/").filter(Boolean);
    const id = segments.at(-1);

    if (!id) return null;

    const parsed = Number(id);
    return Number.isNaN(parsed) ? null : parsed;
}

export function capitalizeWords(sentence: string) {
    return sentence.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}