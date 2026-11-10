const assert = require("node:assert/strict");
const { afterEach, beforeEach, describe, test } = require("node:test");
const fs = require("node:fs");
const Module = require("node:module");
const { JSDOM } = require("jsdom");

require("@babel/register")({ extensions: [".js"] });

require.extensions[".html"] = (module, filename) => {
  module.exports = fs.readFileSync(filename, "utf8");
};

const pages = {
  home: () => {
    const element = global.document.createElement("section");
    element.textContent = "Home page";
    return element;
  },
  posts: async () => {
    const element = global.document.createElement("section");
    element.textContent = "Posts page";
    return element;
  },
  notFound: () => {
    const element = global.document.createElement("section");
    element.textContent = "Not found";
    return element;
  },
};

const controllersPath = require.resolve("../src/controllers/index.js");
const controllersModule = new Module(controllersPath);
controllersModule.filename = controllersPath;
controllersModule.loaded = true;
controllersModule.exports = { pages };
require.cache[controllersPath] = controllersModule;

const { router } = require("../src/router/index.routes.js");

describe("router", () => {
  let dom;
  let root;

  beforeEach(() => {
    dom = new JSDOM("<!doctype html><html><body></body></html>");
    global.document = dom.window.document;
    root = global.document.createElement("div");
    root.id = "root";
    root.innerHTML = "<span>Previous content</span>";
    global.document.body.appendChild(root);
  });

  afterEach(() => {
    dom.window.close();
    delete global.document;
  });

  for (const [route, expectedContent] of [
    ["#/", "Home page"],
    ["#/posts", "Posts page"],
    ["#/unknown", "Not found"],
  ]) {
    test(`renders the page for route ${route}`, async () => {
      await router(route);
      assert.equal(root.textContent, expectedContent);
    });
  }
});
