const assert = require("node:assert/strict");
const { afterEach, beforeEach, test } = require("node:test");
const fs = require("node:fs");
const { JSDOM } = require("jsdom");

require("@babel/register")({ extensions: [".js"] });

require.extensions[".html"] = (module, filename) => {
  module.exports = fs.readFileSync(filename, "utf8");
};

const Posts = require("../src/controllers/posts.controller.js").default;

let dom;
let originalFetch;

beforeEach(() => {
  dom = new JSDOM("<!doctype html><html><body></body></html>");
  global.document = dom.window.document;
  originalFetch = global.fetch;
});

afterEach(() => {
  dom.window.close();
  delete global.document;
  global.fetch = originalFetch;
});

test("renders fetched posts and their total", async () => {
  const posts = [
    { title: "First post", body: "First body" },
    { title: "Second post", body: "Second body" },
  ];
  let requestedUrl;

  global.fetch = async (url) => {
    requestedUrl = url;
    return {
      json: async () => posts,
    };
  };

  const element = await Posts();

  assert.equal(requestedUrl, "https://jsonplaceholder.typicode.com/posts");
  assert.equal(element.querySelectorAll("#posts li").length, 2);
  assert.deepEqual(
    Array.from(element.querySelectorAll("#posts h5"), (heading) => heading.textContent),
    ["First post", "Second post"],
  );
  assert.deepEqual(
    Array.from(element.querySelectorAll("#posts p"), (paragraph) => paragraph.textContent.trim()),
    ["First body", "Second body"],
  );
  assert.equal(element.querySelector("#total").textContent, "2");
});

test("renders an empty list when there are no posts", async () => {
  global.fetch = async () => ({
    json: async () => [],
  });

  const element = await Posts();

  assert.equal(element.querySelectorAll("#posts li").length, 0);
  assert.equal(element.querySelector("#total").textContent, "0");
});
