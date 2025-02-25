export function isValidHex(hex) {
	return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

export function isValidHSL(hsl) {
	return /^hsl\(\d{1,3},\s*\d{1,3}%?,\s*\d{1,3}%?\)$/.test(hsl);
}
