import { RawSourceMap } from "source-map";
import { SourceMapConsumer } from "source-map/lib/source-map-consumer.js";
import { StackFrame } from "./index";

SourceMapConsumer.initialize({
	"lib/mappings.wasm": "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm",
});

export async function getStackframeSource(frame: StackFrame): Promise<string> {
	return (await (await fetch(frame.getFileName())).text()) as string;
}

export async function getRawSourceMap(
	source: string,
	sourcePath: string,
): Promise<RawSourceMap | undefined> {
	try {
		let sourceMapURL = getSourceMapURL(source);

		if (!sourceMapURL.startsWith("data:"))
			sourceMapURL = getFileFolder(sourcePath) + sourceMapURL;

		return await (await fetch(sourceMapURL)).json();
	} catch (e) {
		return undefined;
	}
}

export function getSourceMapURL(source: string) {
	const sourcemapRegex = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/gm;
	const result = sourcemapRegex.exec(source);

	if (result?.[1]) return result[1];

	throw new Error("sourceMappingURL not found");
}

export function getFileName(sourcePath: string): string {
	return sourcePath.split("/").pop() ?? "";
}

export function getFileFolder(sourcePath: string) {
	return sourcePath.substring(
		0,
		sourcePath.length - getFileName(sourcePath).length,
	);
}

export function getFileExtension(sourcePath: string): string {
	return (getFileName(sourcePath).split(".").pop() ?? "").split("?")[0] ?? "";
}

export function isNodeModule(sourcePath: string) {
	return sourcePath.includes("node_modules");
}
