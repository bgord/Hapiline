export function pluralize(word: string, number: number, plural?: string) {
	if (number === 0 || number === 1) return word;

	if (plural) return plural;

	return `${word}s`;
}
