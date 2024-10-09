import { HomeIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Article",
    to: "/article/:topicId",
    page: <ArticlePage />,
  },
];