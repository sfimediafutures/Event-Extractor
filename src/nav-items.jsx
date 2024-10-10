import { HomeIcon, InfoIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";
import ModelInfo from "./pages/ModelInfo.jsx";

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
  {
    title: "Model Info",
    to: "/model-info",
    icon: <InfoIcon className="h-4 w-4" />,
    page: <ModelInfo />,
  },
];