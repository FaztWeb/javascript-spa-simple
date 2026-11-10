import { router } from "./index.routes";

jest.mock("../controllers/index", () => ({
  pages: {
    home: () => {
      const element = globalThis.document.createElement("section");
      element.textContent = "Home page";
      return element;
    },
    posts: async () => {
      const element = globalThis.document.createElement("section");
      element.textContent = "Posts page";
      return element;
    },
    notFound: () => {
      const element = globalThis.document.createElement("section");
      element.textContent = "Not found";
      return element;
    },
  },
}));

describe("router", () => {
  let root;

  beforeEach(() => {
    root = document.createElement("div");
    root.id = "root";
    root.innerHTML = "<span>Previous content</span>";
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
  });

  test.each([
    ["#/", "Home page"],
    ["#/posts", "Posts page"],
    ["#/unknown", "Not found"],
  ])("renders the page for route %s", async (route, expectedContent) => {
    await router(route);

    expect(root.textContent).toBe(expectedContent);
  });
});
