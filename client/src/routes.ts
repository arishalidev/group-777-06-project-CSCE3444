import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { SearchResults } from "./pages/SearchResults";
import { Navigator } from "./pages/Navigator";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/search",
    Component: SearchResults,
  },
  {
    path: "/navigator",
    Component: Navigator,
  },
]);
