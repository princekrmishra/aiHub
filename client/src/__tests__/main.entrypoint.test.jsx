/**
 * Entry bootstrap tests for client/src/main.*
 * Detected framework: Unknown (tests are framework-agnostic and support Jest/Vitest)
 * Approach: Mock react-dom/client.createRoot to capture render calls.
 * - Verifies createRoot is called with document.getElementById('root')
 * - Ensures StrictMode wraps the tree
 * - Checks behavior when #root is missing
 * - Asserts errors from createRoot bubble and prevent render
 *
 * Note: We intentionally create a new test file because client/src/main.test.jsx
 * contains bootstrap code, not tests. We test that file (or main.jsx/tsx) from here.
 */

import React, { StrictMode } from "react";

const M = globalThis.vi || globalThis.jest;
if (!M) {
  throw new Error("Neither Vitest nor Jest detected. Please run tests with one of them.");
}

let renderMock;
let createRootMock;

// Mock react-dom/client BEFORE importing the entry module
M.mock("react-dom/client", () => {
  renderMock = M.fn();
  createRootMock = M.fn(() => ({ render: renderMock }));
  return { createRoot: createRootMock };
});

// Helper to import the module under test with module cache isolation when available
async function importEntry() {
  if (M.resetModules) { M.resetModules(); }
  try { return await import("../main.jsx"); } catch {}
  try { return await import("../main.tsx"); } catch {}
  try { return await import("../main.js"); } catch {}
  // Fallback: the provided file path acts as the entrypoint in this PR
  return await import("../main.test.jsx");
}

describe("client/src/main entrypoint bootstrap", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    if (createRootMock) createRootMock.mockClear();
    if (renderMock) renderMock.mockClear();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("creates a root for #root and renders StrictMode with an App child", async () => {
    await importEntry();

    const rootEl = document.getElementById("root");
    expect(createRootMock).toHaveBeenCalledTimes(1);
    expect(createRootMock).toHaveBeenCalledWith(rootEl);

    expect(renderMock).toHaveBeenCalledTimes(1);
    const rendered = renderMock.mock.calls[0][0];

    // StrictMode wrapper
    expect(rendered && rendered.type).toBe(StrictMode);

    // App child exists and is a valid React element (we don't assert identity to avoid coupling)
    const child = Array.isArray(rendered?.props?.children)
      ? rendered.props.children[0]
      : rendered?.props?.children;
    expect(React.isValidElement(child)).toBe(true);
  });

  it("passes null to createRoot when #root is missing", async () => {
    document.body.innerHTML = ""; // remove container

    await importEntry();

    expect(createRootMock).toHaveBeenCalledTimes(1);
    expect(createRootMock).toHaveBeenCalledWith(null);
    // Our mock still returns a renderer; verify render invoked with a React element
    expect(renderMock).toHaveBeenCalledTimes(1);
    const rendered = renderMock.mock.calls[0][0];
    expect(React.isValidElement(rendered)).toBe(true);
  });

  it("bubbles errors thrown by createRoot and does not call render", async () => {
    document.body.innerHTML = '<div id="root"></div>';

    createRootMock.mockImplementationOnce(() => {
      throw new Error("createRoot exploded");
    });

    await expect(importEntry()).rejects.toThrow(/createRoot exploded/);
    expect(renderMock).not.toHaveBeenCalled();
  });
});