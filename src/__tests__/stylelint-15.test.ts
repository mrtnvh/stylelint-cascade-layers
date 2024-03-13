import Snap from "@matteo.collina/snap";
import { resolve } from "node:path";
import { describe, test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import stylelint from "stylelint";
const snap = Snap(import.meta.url);
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// @ts-expect-error
const { default: config } = await import("./stylelint.test.config.cjs");

describe("Stylelint 15", () => {
  describe("flags no warnings with valid css", () => {
    const validCss = fs.readFileSync(resolve(__dirname, "./valid.css"), "utf-8");
    let result: stylelint.LinterResult;

    beforeEach(async () => {
      result = await stylelint.lint({
        code: validCss,
        config,
      });
    });

    test("did not error", () => {
      assert.equal(result.errored, false);
    });

    test("flags no warnings", () => {
      assert.equal(result.results[0].warnings.length, 0);
    });
  });

  describe("flags warnings with invalid css", () => {
    const invalidCss = fs.readFileSync(resolve(__dirname, "./invalid.css"), "utf-8");
    let result: stylelint.LinterResult;

    beforeEach(async () => {
      result = await stylelint.lint({
        code: invalidCss,
        config,
      });
    });

    test("did error", () => {
      assert.equal(result.errored, true);
    });

    test("flags warnings", () => {
      assert.equal(result.results[0].warnings.length, 1);
    });

    test("correct warning text", async () => {
      const actual = JSON.stringify(result.results[0].warnings.map((w) => w.text));
      const snapshot = await snap(actual);
      assert.deepEqual(actual, snapshot);
    });

    test("correct rule flagged", async () => {
      const actual = JSON.stringify(result.results[0].warnings.map((w) => w.rule));
      const snapshot = await snap(actual);
      assert.deepEqual(actual, snapshot);
    });

    test("correct severity flagged", () => {
      assert.equal(result.results[0].warnings[0].severity, "error");
    });

    test("correct line number", () => {
      assert.equal(result.results[0].warnings[0].line, 1);
    });

    test("correct column number", () => {
      assert.equal(result.results[0].warnings[0].column, 1);
    });
  });

  describe("deprecated rules", () => {
    const deprecatedRuleNames = Object.values(stylelint.rules)
      .filter((rule) => rule.meta?.deprecated)
      .map((rule) => rule.ruleName);

    const testFn = deprecatedRuleNames.length === 0 ? test.skip : test;

    testFn("exclude deprecate rules", () => {
      // eslint-disable-next-line jest/no-standalone-expect -- If not using `it` directly, false positives occur.
      const includesDeprecatedRule = deprecatedRuleNames.some((ruleName) =>
        Object.keys(config.rules).includes(ruleName)
      );
      assert.equal(includesDeprecatedRule, false);
    });
  });
});
