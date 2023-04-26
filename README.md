<div align="center">
  <img width="400" src="https://github.com/jundaoapp/zut/blob/main/.github/zut-banner.png?raw=true" alt="Jundao Zut banner">
</div>

<h1 align="center">@jundao/zut</h1>

<div align="center">

  Pretty error overlay for browser side JS errors.

  Zut (French word for "damn", pronouced [`/zyt/`](https://s3-eu-west-1.amazonaws.com/com.idmgroup.lab.sounds.prod/fr/a/8/c/a8cd54ec3d9cdf563b4c3558ee28e4ee.mp3))

  [![license](https://img.shields.io/badge/license-MIT-1890ff.svg)](https://github.com/jundaoapp/design/blob/main/LICENSE)
  [![checks](https://img.shields.io/github/checks-status/jundaoapp/zut/main)](https://github.com/jundaoapp/design/actions)
  [![npm](https://img.shields.io/npm/v/@jundao/zut)](https://www.npmjs.com/package/@jundao/design)

</div>

# Features
* UI Agnostic - Built with vanilla JS and DOM & works with any framework.
* Useful - Uses source maps when available to preview the exact source code.
* Language Agnostic - Config options for extending default preview languages.
* Type Safe - Entirely coded in [Typescript](https://www.typescriptlang.org/).
* Modern - Uses the latest available ES & CSS features.

# Usage
Install `@jundao/zut`:
```bash
npm install @jundao/zut
# or
yarn add @jundao/zut
# or
pnpm add @jundao/zut
```

Import and run:
```ts
import Zut from "@jundao/zut";


try {
  yourCode();
} catch (error) { // Supports any throwable
  new Zut(error);
}
```
:sparkles: All done!

# Contributing
Before contributing please refer to [CONTRIBUTING.md](./CONTRIBUTING.md).

All contributions are moderated under the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md).