import stylelint from "stylelint";
import type { Rule, PostcssResult } from "stylelint";
import type { Container, ChildNode, Declaration } from "postcss";

import {
  ruleMeta,
  ruleName,
  ruleMessages as messages,
  ruleDefaultSecondaryOptions,
  type PrimaryOption,
  type SecondaryOptions,
} from "./base.js";

const {
  createPlugin,
  utils: { report, validateOptions },
} = stylelint;

function traverseParentRules(parent: Container<ChildNode> | undefined, secondaryOptions: SecondaryOptions) {
  const parentParent = parent?.parent as Container<ChildNode> | undefined;
  if (!parentParent) return false;
  const { type } = parentParent;

  if (type === "root") return false;

  if (type === "atrule" && testIfNodeToIgnore(parentParent, secondaryOptions)) {
    return true;
  }

  return traverseParentRules(parentParent, secondaryOptions);
}

function testIfNodeToIgnore(node: Container<ChildNode>, secondaryOptions: SecondaryOptions) {
  // @ts-ignore
  const nodeName = node.name as string;
  // @ts-ignore
  const nodeSelector = node.selector as string;

  const isLayerAtRule = nodeName === "layer";

  const atRuleToIgnore = secondaryOptions.ignoreAtRules.some((ignoreAtRule) => {
    const sanitizedIgnoreAtRule = ignoreAtRule.replace("@", "");
    return sanitizedIgnoreAtRule === nodeName;
  });

  const selectorToIgnore = secondaryOptions.ignoreSelectors.some((ignoreSelectors) => ignoreSelectors === nodeSelector);

  if (isLayerAtRule || atRuleToIgnore || selectorToIgnore) return true;
}

function testIfWrappedInLayer(decl: Declaration, result: PostcssResult, secondaryOptions: SecondaryOptions) {
  const parent = decl.parent;
  if (!parent) return;

  // @ts-ignore
  const parentName = parent.name as string;
  // @ts-ignore
  const parentSelector = parent.selector as string;

  const isWrappedInLayerAtRule = traverseParentRules(decl as unknown as Container<ChildNode>, secondaryOptions);

  if (!isWrappedInLayerAtRule) {
    const name = (() => {
      switch (parent.type) {
        case "atrule":
        case "root":
          return parentName;
        default:
          return parentSelector;
      }
    })();

    report({
      message: messages.cascadeLayers(parent.type, name),
      node: parent,
      result,
      ruleName,
    });
  }
}

const ruleFunction: Rule<PrimaryOption> = (primary, _secondaryOptions, options) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });

    if (!validOptions) return;

    const secondaryOptions: SecondaryOptions = (_secondaryOptions as SecondaryOptions) || ruleDefaultSecondaryOptions;

    root.walkDecls((decl) => testIfWrappedInLayer(decl, result, secondaryOptions));
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = ruleMeta;

export default createPlugin(ruleName, ruleFunction);
