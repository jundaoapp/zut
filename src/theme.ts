export interface ZutTheme {
	background: string;
	activeBackground: string;
	hoverBackground: string;
	highlightedBackground: string;
	textColor: string;
	mutedOpacity: number;
	accentColor: string;
	sansFont: string;
	monoFont: string;
}

export const defaultTheme: ZutTheme = {
	background: "#0b0c0c",
	activeBackground: "#222426",
	hoverBackground: "#141516",
	highlightedBackground: "#3c3f42",
	textColor: "#f7fafc",
	mutedOpacity: 0.5,
	accentColor: "#f4242f",
	sansFont: "'Inter', sans-serif",
	monoFont: "'JetBrains Mono', monospace",
};

export function combineTheme(theme?: Partial<ZutTheme>): ZutTheme {
	return { ...defaultTheme, ...theme };
}
