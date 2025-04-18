import PropTypes from "prop-types";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useEffect } from "react";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, openSidenav } = controller;
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/sign-in");
  };

  // Redirect to sign-in if no token
  useEffect(() => {
    if (!adminToken) {
      navigate("/auth/sign-in");
    }
  }, [adminToken, navigate]);

  // Don't render anything if there's no admin token
  if (!adminToken) {
    return null;
  }

  // Filter out hidden routes
  const visibleRoutes = routes.filter((route) => !route.hidden);

  return (
    <aside
      className={`bg-[#181818] ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-[#F0BB78]/20`}
    >
      <div className="relative">
        <Link to="/" className="py-6 px-8 text-center">
          <Typography variant="h6" className="text-white">
            {brandName}
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4 h-[calc(100%-180px)] overflow-y-auto">
        {visibleRoutes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  className="font-black uppercase text-[#F0BB78] opacity-90"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path }) => (
              <li key={name}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      className={`flex items-center gap-4 px-4 capitalize ${
                        isActive
                          ? "bg-[#F0BB78] text-[#181818]"
                          : "text-white hover:bg-[#F0BB78]/10"
                      }`}
                      fullWidth
                    >
                      <div
                        className={
                          isActive ? "text-[#181818]" : "text-[#F0BB78]"
                        }
                      >
                        {icon}
                      </div>
                      <Typography
                        className={`font-medium capitalize ${
                          isActive ? "text-[#181818]" : "text-white"
                        }`}
                      >
                        {name}
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ))}
      </div>

      {/* Fixed Logout Button at the bottom */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <Button
          variant="text"
          className="flex items-center gap-4 px-4 capitalize text-white hover:bg-[#F0BB78]/10"
          fullWidth
          onClick={handleLogout}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 text-[#F0BB78]" />
          <Typography className="font-medium capitalize text-white">
            Logout
          </Typography>
        </Button>
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "Elite-Fit",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
