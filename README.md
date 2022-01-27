# weak tree shaking - `sideEffects: false` investigation

It has been suggested that if sideEffects is set to `false`, tree-shaking shall occur in next.js client builds.
This is documented in the webpack documentation, with moderate completeness. However, in practice
in a monorepo structure, post Terser DCE, unused imports are _not shaken_ when `sideEffects: false`
is set at every possible package level.

## Grokking the the reproduction

The reproduction is minimal and simple.

- it is common for monorepos to have a `packages` (or `libs`) like folder. here, we have just `packages/async-hooks-thing`
  - `packages/async-hooks-thing/package.json` has `sideEffects: false`, and indeed is an es module
- `<root>/package.json` has `sideEffects: false`
- `pages/index.js`, post terser processing, will have an _unused_ `init` function
  - in the client webpack compilation phase, `init` is not shaken out

One can observe the terser output by visiting terser.org's repl:

```js
// terser input
import { init } from "../packages/async-hooks-thing";

export default function Home() {
  return React.createElement("h1");
}

export const getInitialProps = false // WebpackDefine plugin will swap out "typeof window = ..."
  ? () => {
      init();
      return { hmm: 234 * Math.random() };
    }
  : undefined;
```

yields:

```js
// terser output
import { init as t } from "../packages/async-hooks-thing";
// sideEffects: false, but this is NOT shaken

export default function e() {
  return React.createElement("h1");
}

export const getInitialProps = void 0;
```

## usage

- `yarn && yarn build`
- client compilation fails, trying to resolve a `node` only module, `async_hooks`
  - however, it would be ideal if tree-shaking and DCE dropped such an import, thus compiling successfully
