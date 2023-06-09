import { combineTheme, ZutTheme } from "./theme";
import { createContext } from "context";
import { closeOverlay, getOverlay } from "./overlay";
import { parseError, StackFrame } from "./stacktrace";

export interface ZutOptions {
	shortcuts?: string[];
	theme?: Partial<ZutTheme>;
	maxHighlightLenght?: number;
	noStacktraceTranslation?: string;
	unknownTranslation?: string;
	toggleMutedTranslation?: string;
	presetExtension?: Record<string, string>;
	mutedEntries?: RegExp[];
	closable?: boolean;
}

interface ZutContext {
	error: unknown;
	stackframes: StackFrame[];
	options: ZutOptions;
	theme: ZutTheme;
}

const zutContext = createContext<ZutContext>();

export default class Zut {
	constructor(error: unknown, options: ZutOptions = {}) {
		this.bootstrap(error, options);
	}

	private async bootstrap(error: unknown, options: ZutOptions) {
		const context: ZutContext = {
			error,
			options: {
				maxHighlightLenght: 4000,
				noStacktraceTranslation: "No Stacktrace",
				unknownTranslation: "Unknown",
				toggleMutedTranslation: "Show All",
				closable: true,
				...options,
				presetExtension: {
					ts: "typescript",
					js: "javascript",
					...options.presetExtension,
				},
				mutedEntries: [/node_modules/, ...(options.mutedEntries || [])],
			},
			theme: combineTheme(options.theme),
			stackframes:
				error instanceof Error ? await parseError(error as Error) : [],
		};

		zutContext.run(context, this.run);
	}

	private run() {
		document.body.appendChild(getOverlay());
	}

	public close() {
		closeOverlay();
	}
}

export function useZutContext(): ZutContext {
	return zutContext.use();
}
