import {
  HomeIcon,
  TableCellsIcon,
  ServerStackIcon,
} from "@heroicons/react/24/solid";
import { Home } from "@/pages/dashboard";
import SignIn from "@/pages/auth/sign-in"; // Corrected import for default export
import User1 from "./pages/dashboard/user";
import Products from "./pages/dashboard/products";
import Order from "./pages/dashboard/order";
import Message from "./pages/dashboard/message";
import CommentAndReport from "./pages/dashboard/CommentAndReport";
import { Package, MessageSquare, User } from "lucide-react";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <User {...icon} />,
        name: "users",
        path: "/users",
        element: <User1 />,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "products",
        path: "/products",
        element: <Products />,
      },
      {
        icon: <Package {...icon} />,
        name: "order",
        path: "/order",
        element: <Order />,
      },
      {
        icon: <MessageSquare {...icon} />,
        name: "message",
        path: "/message",
        element: <Message />,
      },
      {
        icon: <MessageSquare {...icon} />,
        name: "Comment & Report",
        path: "/comment-report",
        element: <CommentAndReport />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    hidden: true,
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />, // Correct usage for default export
      },
    ],
  },
];

export default routes;
