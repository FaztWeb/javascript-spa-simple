const assert = require("node:assert/strict");
const { afterEach, beforeEach, test } = require("node:test");
const fs = require("node:fs");
const { JSDOM } = require("jsdom");

require("@babel/register")({ extensions: [".js"] });

require.extensions[".html"] = (module, filename) => {
  module.exports = fs.readFileSync(filename, "utf8");
};

const Home = require("../src/controllers/home.controller.js").default;

let dom;
let originalAlert;

beforeEach(() => {
  dom = new JSDOM("<!doctype html><html><body></body></html>");
  global.document = dom.window.document;
  originalAlert = global.alert;
});

afterEach(() => {
  dom.window.close();
  delete global.document;
  if (originalAlert === undefined) {
    delete global.alert;
  } else {
    global.alert = originalAlert;
  }
});

test("clicking the home button displays the clicked alert", () => {
  let alertMessage;
  global.alert = (message) => {
    alertMessage = message;
  };

  const element = Home();
  const button = element.querySelector("#btnClick");

  assert.ok(button);
  button.click();

  assert.equal(alertMessage, "clicked");
});
