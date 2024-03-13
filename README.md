# stylelint-cascade-layers

Stylelint plugin to enforce usage of cascade layers.

## Requirements

This plugin is built to work with both Stylelint v15 and v16.

## Installation

Add `stylelint-cascade-layers` and `stylelint` itself to your project:

```sh
npm install -D stylelint stylelint-cascade-layers
```

## Usage

### Default

```js
{
  plugins: ["stylelint-cascade-layers"],
  rules: {
    "cascade-layers/require-layers": true,
  },
}
```

### With options

```js
{
  plugins: ["stylelint-cascade-layers"],
  rules: {
    "cascade-layers/require-layers": [true, {
        ignoreAtRules: [
          "@charset",
          "@font-face",
          "@font-feature-values",
          "@font-palette-values",
          "@import",
          "@keyframes",
          "@property",
          "@styleset",
        ],
        ignoreSelectors: [],
    }],
  },
}
```

## Options

| Option            | Type       | Default                                                                                                                         | Description                  |
| ----------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `ignoreAtRules`   | `string[]` | `["@charset", "@font-face", "@font-feature-values", "@font-palette-values", "@import", "@keyframes", "@property", "@styleset"]` | List of at-rules to ignore.  |
| `ignoreSelectors` | `string[]` | `[]`                                                                                                                            | List of selectors to ignore. |

Default options will be overridden, not merged with the provided options.

## Misc.

- [LICENSE](https://github.com/mrtnvh/stylelint-cascade-layers/LICENSE)
- [CHANGELOG](https://github.com/mrtnvh/stylelint-cascade-layers/CHANGELOG.md)
