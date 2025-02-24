
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserSettings from "./pages/UserSettings";
import Properties from "./pages/Properties";
import Contributors from "./pages/Contributors";
import Savings from "./pages/Savings";
import Credits from "./pages/Credits";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import UpdatePassword from "./pages/UpdatePassword";
import Landing from "./pages/Landing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/settings",
    element: <UserSettings />,
  },
  {
    path: "/properties",
    element: <Properties />,
  },
  {
    path: "/contributors",
    element: <Contributors />,
  },
  {
    path: "/savings",
    element: <Savings />,
  },
  {
    path: "/credits",
    element: <Credits />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/update-password",
    element: <UpdatePassword />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
