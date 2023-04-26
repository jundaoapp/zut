import { defineConfig } from 'tsup';

export default defineConfig((options) => {
	return {
		platform: "browser",
		format: "esm",
		entry: ['src/index.ts'],
		sourcemap: true,
		clean: true,
		dts: !options.watch,
	};
});