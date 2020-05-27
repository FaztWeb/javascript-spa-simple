import Home from "./home.controller";
import Posts from "./posts.controller";
import NotFound from "./404.controller";

const pages = {
  home: Home,
  posts: Posts,
  notFound: NotFound,
};

export { pages };
