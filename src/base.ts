import stylelint from "stylelint";

export type PrimaryOption = boolean;

export type SecondaryOptions = {
  ignoreAtRules: Array<string>;
  ignoreSelectors: Array<string>;
};

export const ruleName = "cascade-layers/require-layers";

export const ruleMeta = {
  url: "https://github.com/mrtnvh/stylelint-stuff",
};

export const ruleMessages = stylelint.utils.ruleMessages(ruleName, {
  cascadeLayers: (type, name) => {
    return `Unexpected unlayered ${type} "${name}"`;
  },
});

export const ruleDefaultSecondaryOptions = {
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
};
